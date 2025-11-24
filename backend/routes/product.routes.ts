import { Router } from 'express';
import { prisma } from '../index.mjs';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const productRouter = Router();

// GET / - List active products, calculate total stock, and include stock by location
productRouter.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        stocks: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    const productData = products.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      totalStock: product.stocks.reduce((sum, stock) => sum + stock.quantity, 0),
      stockByLocation: product.stocks.map((stock) => ({
        warehouseName: stock.warehouse.name,
        quantity: stock.quantity,
      })),
    }));

    res.status(200).json(productData);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /lookup - Return all Categories and Warehouses
productRouter.get('/lookup', authenticateToken, async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    const warehouses = await prisma.warehouse.findMany();

    res.status(200).json({ categories, warehouses });
  } catch (error) {
    console.error('Error fetching lookup data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST / - Create product with optional initial stock
productRouter.post(
  '/',
  authenticateToken,
  authorizeRole(['ADMIN', 'MANAGER']),
  async (req, res) => {
    const { name, sku, categoryId, uom, initialStock } = req.body;

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Create the product
        const product = await tx.product.create({
          data: {
            name,
            sku,
            categoryId,
            uom,
            isActive: true,
          },
        });

        if (initialStock) {
          const { quantity, warehouseId } = initialStock;

          // Create a Document (ADJUSTMENT, Done)
          const document = await tx.document.create({
            data: {
              type: 'ADJUSTMENT',
              status: 'Done',
              createdById: req.userId!,
            },
          });

          // Create a DocumentLine
          await tx.documentLine.create({
            data: {
              documentId: document.id,
              productId: product.id,
              quantity,
            },
          });

          // Create Stock
          await tx.stock.create({
            data: {
              productId: product.id,
              warehouseId,
              quantity,
            },
          });

          // Create Ledger entry
          await tx.ledger.create({
            data: {
              documentId: document.id,
              productId: product.id,
              quantity,
              direction: 'IN',
              sourceWarehouseId: null,
              destWarehouseId: warehouseId,
              userId: req.userId!,
            },
          });
        }

        return product;
      });

      res.status(201).json({ message: 'Product created successfully', product: result });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default productRouter;