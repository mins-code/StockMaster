import { Router } from 'express';
import { prisma } from '../index.mjs';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const inventoryRouter = Router();

// POST /:type - Create Draft Documents with document lines
inventoryRouter.post('/:type', authenticateToken, async (req, res) => {
  const { type } = req.params;
  const { lines, sourceWarehouseId, destWarehouseId, supplierId } = req.body;

  try {
    // Validate document type
    if (!['RECEIPT', 'DELIVERY', 'TRANSFER', 'ADJUSTMENT'].includes(type)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    // Create the document
    const document = await prisma.document.create({
      data: {
        type,
        status: 'Draft',
        sourceWarehouseId: type === 'TRANSFER' || type === 'DELIVERY' ? sourceWarehouseId : null,
        destWarehouseId: type === 'TRANSFER' || type === 'RECEIPT' ? destWarehouseId : null,
        supplierId: type === 'RECEIPT' ? supplierId : null,
        createdById: req.userId!,
      },
    });

    // Create document lines
    const documentLines = lines.map((line) => ({
      documentId: document.id,
      productId: line.productId,
      quantity: line.quantity,
    }));

    await prisma.documentLine.createMany({
      data: documentLines,
    });

    res.status(201).json({ message: 'Draft document created successfully', document });
  } catch (error) {
    console.error('Error creating draft document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /:type/:id/validate - Validate and finalize documents
inventoryRouter.post('/:type/:id/validate', authenticateToken, async (req, res) => {
  const { type, id } = req.params;

  try {
    // Validate document type
    if (!['RECEIPT', 'DELIVERY', 'TRANSFER', 'ADJUSTMENT'].includes(type)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    // Fetch the document and its lines
    const document = await prisma.document.findUnique({
      where: { id: Number(id) },
      include: {
        documentLines: true,
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.status !== 'Draft') {
      return res.status(400).json({ error: 'Only Draft documents can be validated' });
    }

    // Perform validation and stock updates in a transaction
    await prisma.$transaction(async (tx) => {
      for (const line of document.documentLines) {
        const { productId, quantity } = line;

        if (type === 'RECEIPT' || type === 'ADJUSTMENT') {
          // Increment stock
          await tx.stock.upsert({
            where: {
              productId_warehouseId: {
                productId,
                warehouseId: document.destWarehouseId!,
              },
            },
            update: {
              quantity: { increment: quantity },
            },
            create: {
              productId,
              warehouseId: document.destWarehouseId!,
              quantity,
            },
          });

          // Create Ledger entry
          await tx.ledger.create({
            data: {
              documentId: document.id,
              productId,
              quantity,
              direction: 'IN',
              sourceWarehouseId: null,
              destWarehouseId: document.destWarehouseId!,
              userId: req.userId!,
            },
          });
        } else if (type === 'DELIVERY' || type === 'TRANSFER') {
          // Check stock availability
          const stock = await tx.stock.findUnique({
            where: {
              productId_warehouseId: {
                productId,
                warehouseId: document.sourceWarehouseId!,
              },
            },
          });

          if (!stock || stock.quantity < quantity) {
            throw new Error(`Insufficient stock for product ID ${productId}`);
          }

          // Decrement stock
          await tx.stock.update({
            where: {
              productId_warehouseId: {
                productId,
                warehouseId: document.sourceWarehouseId!,
              },
            },
            data: {
              quantity: { decrement: quantity },
            },
          });

          // Create Ledger entry
          await tx.ledger.create({
            data: {
              documentId: document.id,
              productId,
              quantity,
              direction: 'OUT',
              sourceWarehouseId: document.sourceWarehouseId!,
              destWarehouseId: type === 'TRANSFER' ? document.destWarehouseId : null,
              userId: req.userId!,
            },
          });
        }
      }

      // Update document status to 'Done'
      await tx.document.update({
        where: { id: document.id },
        data: { status: 'Done' },
      });
    });

    res.status(200).json({ message: 'Document validated successfully' });
  } catch (error) {
    console.error('Error validating document:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default inventoryRouter;