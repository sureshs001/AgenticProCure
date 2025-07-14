import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './utils/errorHandler';
import { authMiddleware } from './utils/authMiddleware';

// Import routes
import agentRoutes from './api/routes/agents';
import complianceRoutes from './api/routes/compliance';
import productRequirementsRoutes from './api/routes/productRequirements';
import rfpRoutes from './api/routes/rfps';
import supplierRoutes from './api/routes/suppliers';
import userRoutes from './api/routes/users';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/agents', authMiddleware, agentRoutes);
app.use('/api/compliance', authMiddleware, complianceRoutes);
app.use('/api/product-requirements', authMiddleware, productRequirementsRoutes);
app.use('/api/rfps', authMiddleware, rfpRoutes);
app.use('/api/suppliers', authMiddleware, supplierRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Agentic ProCURE Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app; 