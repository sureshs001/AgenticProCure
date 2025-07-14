import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../../utils/authMiddleware';
import { Supplier } from '@agentic-procure/shared';

const router = Router();

// Get all suppliers
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const suppliers: Supplier[] = [];

    res.json({
      success: true,
      data: {
        items: suppliers,
        total: suppliers.length,
        page: 0,
        limit: 20,
        hasMore: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch suppliers',
    });
  }
});

export default router; 