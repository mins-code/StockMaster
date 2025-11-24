import { Router } from 'express';
import { prisma } from '../prisma.js'; // Updated import
import { authenticateToken } from '../middleware/auth.js';

const dashboardRouter = Router();

// GET /kpis - Calculate and return KPIs
dashboardRouter.get('/kpis', authenticateToken, async (req, res) => {
  try {
    // Calculate total stock
    const totalStock = await prisma.stock.aggregate({
      _sum: {
        quantity: true,
      },
    });

    // Count low stock (quantity <= 10)
    const lowStockCount = await prisma.stock.count({
      where: {
        quantity: {
          lte: 10,
        },
      },
    });

    // Count pending Documents
    const pendingDocuments = await prisma.document.groupBy({
      by: ['type', 'status'],
      _count: {
        id: true,
      },
      where: {
        status: {
          in: ['Draft', 'Waiting', 'Ready'],
        },
        type: {
          in: ['RECEIPT', 'DELIVERY', 'TRANSFER'],
        },
      },
    });

    // Format pending document counts
    const documentCounts = pendingDocuments.reduce((acc, doc) => {
      const key = `${doc.type}_${doc.status}`;
      acc[key] = doc._count.id;
      return acc;
    }, {});

    // Response
    res.status(200).json({
      totalStock: totalStock._sum.quantity || 0,
      lowStockCount,
      documentCounts,
    });
  } catch (error) {
    console.error('Error calculating KPIs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default dashboardRouter;
//# sourceMappingURL=dashboard.routes.js.map