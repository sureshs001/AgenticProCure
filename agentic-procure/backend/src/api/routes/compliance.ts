import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../../utils/authMiddleware';
import { ComplianceDashboard, Alert, Supplier } from '@agentic-procure/shared';

const router = Router();

// Get compliance dashboard data
router.get('/dashboard', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock compliance dashboard data for MVP
    const dashboard: ComplianceDashboard = {
      totalSuppliers: 45,
      compliantSuppliers: 38,
      atRiskSuppliers: 7,
      recentAlerts: [
        {
          id: 'alert-001',
          type: 'compliance_risk',
          severity: 'high',
          title: 'Supplier Compliance Risk Detected',
          message: 'PharmaCorp Solutions has a compliance risk score of 75% for ISO 13485',
          relatedEntities: ['supp-001'],
          isRead: false,
          actionRequired: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'alert-002',
          type: 'deadline_approaching',
          severity: 'medium',
          title: 'Compliance Deadline Approaching',
          message: 'FDA 21 CFR 820 compliance assessment due in 30 days',
          relatedEntities: ['supp-002'],
          isRead: true,
          actionRequired: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      upcomingDeadlines: [
        {
          id: 'iso-13485-2016',
          name: 'ISO 13485:2016',
          description: 'Medical devices - Quality management systems - Requirements for regulatory purposes',
          category: 'iso',
          version: '2016',
          effectiveDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      riskTrends: [
        { date: '2024-01-01', riskScore: 25 },
        { date: '2024-01-02', riskScore: 28 },
        { date: '2024-01-03', riskScore: 32 },
        { date: '2024-01-04', riskScore: 30 },
        { date: '2024-01-05', riskScore: 35 },
      ],
    };

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch compliance dashboard',
    });
  }
});

// Get compliance alerts
router.get('/alerts', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { severity, type, limit = 20, offset = 0 } = req.query;

    // Mock alerts for MVP
    const alerts: Alert[] = [
      {
        id: 'alert-001',
        type: 'compliance_risk',
        severity: 'high',
        title: 'Supplier Compliance Risk Detected',
        message: 'PharmaCorp Solutions has a compliance risk score of 75% for ISO 13485',
        relatedEntities: ['supp-001'],
        isRead: false,
        actionRequired: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'alert-002',
        type: 'deadline_approaching',
        severity: 'medium',
        title: 'Compliance Deadline Approaching',
        message: 'FDA 21 CFR 820 compliance assessment due in 30 days',
        relatedEntities: ['supp-002'],
        isRead: true,
        actionRequired: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'alert-003',
        type: 'supplier_update',
        severity: 'low',
        title: 'Supplier Status Updated',
        message: 'PackagingPro Ltd has updated their compliance documentation',
        relatedEntities: ['supp-003'],
        isRead: false,
        actionRequired: false,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    res.json({
      success: true,
      data: {
        items: alerts,
        total: alerts.length,
        page: parseInt(offset as string) || 0,
        limit: parseInt(limit as string) || 20,
        hasMore: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch compliance alerts',
    });
  }
});

// Get compliance standards
router.get('/standards', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;

    // Mock compliance standards for MVP
    const standards = [
      {
        id: 'iso-13485-2016',
        name: 'ISO 13485:2016',
        description: 'Medical devices - Quality management systems - Requirements for regulatory purposes',
        category: 'iso',
        version: '2016',
        effectiveDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'fda-21-cfr-820',
        name: 'FDA 21 CFR 820',
        description: 'Quality System Regulation for medical devices',
        category: 'fda',
        version: '2023',
        effectiveDate: new Date().toISOString(),
      },
      {
        id: 'fda-21-cfr-211',
        name: 'FDA 21 CFR 211',
        description: 'Current Good Manufacturing Practice for Finished Pharmaceuticals',
        category: 'fda',
        version: '2023',
        effectiveDate: new Date().toISOString(),
      },
    ];

    res.json({
      success: true,
      data: {
        items: standards,
        total: standards.length,
        page: parseInt(offset as string) || 0,
        limit: parseInt(limit as string) || 20,
        hasMore: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch compliance standards',
    });
  }
});

export default router; 