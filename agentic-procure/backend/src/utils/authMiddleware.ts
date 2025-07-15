import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organization: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // For MVP, we'll use a simple API key authentication
    // In production, this should be replaced with proper JWT or AWS Cognito
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      throw createError('API key required', 401);
    }

    // For MVP, we'll use a simple validation
    // In production, validate against a database or AWS Cognito
    const validApiKey = process.env.API_KEY || 'agentic-procure-dev-key-123';
    if (apiKey !== validApiKey) {
      throw createError('Invalid API key', 401);
    }

    // Mock user for MVP - in production, decode JWT or get user from Cognito
    req.user = {
      id: 'user-001',
      email: 'procurement@company.com',
      role: 'procurement_manager',
      organization: 'MedTech Corp',
    };

    next();
  } catch (error) {
    next(error);
  }
}; 