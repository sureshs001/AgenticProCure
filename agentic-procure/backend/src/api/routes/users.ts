import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../../utils/authMiddleware';

const router = Router();

// Get current user
router.get('/me', async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
    });
  }
});

export default router; 