import { Router } from 'express';
import { prisma } from '../prisma.js'; // Updated import
import { authenticateToken } from '../middleware/auth.js';

const ledgerRouter = Router();

// GET / - Fetch all Ledger entries with filtering
ledgerRouter.get('/', authenticateToken, async (req, res) => {
    const { docType, direction } = req.query;
    try {
        // Build query filters
        const filters = {};
        if (docType) {
            filters.document = {
                type: docType,
            };
        }
        if (direction) {
            filters.direction = direction;
        }
        // Fetch ledger entries with related data
        const ledgerEntries = await prisma.ledger.findMany({
            where: filters,
            include: {
                product: {
                    select: {
                        name: true,
                    },
                },
                document: {
                    select: {
                        type: true,
                        status: true,
                    },
                },
                sourceWarehouse: {
                    select: {
                        name: true,
                    },
                },
                destWarehouse: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
        });
        // Format response
        const formattedEntries = ledgerEntries.map((entry) => ({
            id: entry.id,
            productName: entry.product.name,
            documentType: entry.document.type,
            documentStatus: entry.document.status,
            quantity: entry.quantity,
            direction: entry.direction,
            sourceWarehouse: entry.sourceWarehouse?.name || 'N/A',
            destWarehouse: entry.destWarehouse?.name || 'N/A',
            timestamp: entry.timestamp,
        }));
        res.status(200).json(formattedEntries);
    } catch (error) {
        console.error('Error fetching ledger entries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default ledgerRouter;
//# sourceMappingURL=ledger.routes.js.map