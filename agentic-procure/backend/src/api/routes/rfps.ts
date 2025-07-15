import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../../utils/authMiddleware';
import { 
  RFPDashboard, 
  RFP, 
  RFPArtifact,
  ComplianceMatrix,
  RegulatoryChecklist,
  ProductSpecification,
  QualityRequirement,
  SupplierEvaluationMatrix,
  ResponseTemplate,
  RFPWorkflowStep,
  ApiResponse 
} from '@agentic-procure/shared';

const router = Router();

// Get RFP dashboard
router.get('/dashboard', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dashboard: RFPDashboard = {
      activeRFPs: 3,
      draftRFPs: 2,
      completedRFPs: 8,
      recentRFPs: [],
      upcomingDeadlines: [],
      supplierResponses: [],
    };

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RFP dashboard',
    });
  }
});

// Get all RFPs
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rfps: RFP[] = [];

    res.json({
      success: true,
      data: {
        items: rfps,
        total: rfps.length,
        page: 0,
        limit: 20,
        hasMore: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RFPs',
    });
  }
});

// Create new RFP
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, deadline, budget } = req.body;
    
    const newRFP: Partial<RFP> = {
      id: `rfp-${Date.now()}`,
      title,
      description,
      products: [],
      suppliers: [],
      status: 'draft',
      deadline,
      requirements: [],
      workflowStatus: [
        { step: 'basic_info', status: 'completed', completedAt: new Date().toISOString() },
        { step: 'product_selection', status: 'pending' },
        { step: 'supplier_discovery', status: 'pending' },
        { step: 'artifact_generation', status: 'pending' },
        { step: 'review', status: 'pending' },
        { step: 'publish', status: 'pending' }
      ],
      artifacts: [],
      budget,
      timeline: {
        responseDeadline: deadline,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: newRFP,
      message: 'RFP created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create RFP',
    });
  }
});

// Get RFP by ID
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock RFP data - in production this would come from database
    const mockRFP: RFP = {
      id,
      title: 'Medical Device Software RFP',
      description: 'Request for proposals for medical device software development',
      products: ['prod-001'],
      suppliers: [],
      status: 'draft',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      requirements: [],
      workflowStatus: [
        { step: 'basic_info', status: 'completed', completedAt: new Date().toISOString() },
        { step: 'product_selection', status: 'in_progress' },
        { step: 'supplier_discovery', status: 'pending' },
        { step: 'artifact_generation', status: 'pending' },
        { step: 'review', status: 'pending' },
        { step: 'publish', status: 'pending' }
      ],
      artifacts: [],
      timeline: {
        responseDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: mockRFP
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch RFP',
    });
  }
});

// Update RFP workflow step
router.patch('/:id/workflow/:step', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, step } = req.params;
    const { status, data } = req.body;
    
    res.json({
      success: true,
      message: `Workflow step ${step} updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update workflow step',
    });
  }
});

// Generate AI-powered artifacts
router.post('/:id/artifacts/generate', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { artifactTypes, productData, requirements } = req.body;
    
    const generatedArtifacts: RFPArtifact[] = [];
    
    // Generate each requested artifact type
    for (const artifactType of artifactTypes) {
      const artifact = await generateArtifact(id, artifactType, productData, requirements);
      generatedArtifacts.push(artifact);
    }
    
    res.json({
      success: true,
      data: generatedArtifacts,
      message: `Generated ${generatedArtifacts.length} artifacts successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate artifacts',
    });
  }
});

// Get artifacts for an RFP
router.get('/:id/artifacts', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const artifacts: RFPArtifact[] = [];
    
    res.json({
      success: true,
      data: artifacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch artifacts',
    });
  }
});

// Get specific artifact
router.get('/:id/artifacts/:artifactId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, artifactId } = req.params;
    
    // Mock artifact data based on type
    const artifact = await getMockArtifact(artifactId);
    
    res.json({
      success: true,
      data: artifact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch artifact',
    });
  }
});

// Helper function to generate artifacts
async function generateArtifact(rfpId: string, type: string, productData: any, requirements: any): Promise<RFPArtifact> {
  const timestamp = new Date().toISOString();
  const artifactId = `artifact-${type}-${Date.now()}`;
  
  let data: any;
  let name: string;
  
  switch (type) {
    case 'compliance_matrix':
      data = generateComplianceMatrix(rfpId, productData);
      name = 'Compliance Requirements Matrix';
      break;
    case 'regulatory_checklist':
      data = generateRegulatoryChecklist(rfpId, productData);
      name = 'Regulatory Checklist';
      break;
    case 'product_specification':
      data = generateProductSpecification(rfpId, productData);
      name = 'Product Specification Sheet';
      break;
    case 'quality_requirements':
      data = generateQualityRequirements(rfpId, productData);
      name = 'Quality Requirements Document';
      break;
    case 'supplier_evaluation':
      data = generateSupplierEvaluationMatrix(rfpId, requirements);
      name = 'Supplier Evaluation Matrix';
      break;
    case 'response_templates':
      data = generateResponseTemplate(rfpId, requirements);
      name = 'Response Templates';
      break;
    default:
      throw new Error(`Unknown artifact type: ${type}`);
  }
  
  return {
    id: artifactId,
    rfpId,
    type: type as any,
    name,
    data,
    status: 'generated',
    generatedBy: 'ai',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

// Mock artifact generators
function generateComplianceMatrix(rfpId: string, productData: any): ComplianceMatrix {
  return {
    id: `compliance-${Date.now()}`,
    rfpId,
    productCategories: productData?.categories || ['medical_device'],
    requirements: [
      {
        id: 'req-001',
        standard: 'ISO 13485',
        requirement: 'Quality Management System for Medical Devices',
        category: 'iso',
        criticality: 'mandatory',
        evidence: 'Valid ISO 13485 certificate and quality manual',
        status: 'pending'
      },
      {
        id: 'req-002',
        standard: 'FDA 21 CFR Part 820',
        requirement: 'Quality System Regulation',
        category: 'fda',
        criticality: 'mandatory',
        evidence: 'FDA registration and 510(k) clearance (if applicable)',
        status: 'pending'
      },
      {
        id: 'req-003',
        standard: 'IEC 62304',
        requirement: 'Medical Device Software Life Cycle Processes',
        category: 'other',
        criticality: 'mandatory',
        evidence: 'Software development process documentation',
        status: 'pending'
      }
    ],
    generatedAt: new Date().toISOString(),
    aiGenerated: true
  };
}

function generateRegulatoryChecklist(rfpId: string, productData: any): RegulatoryChecklist {
  return {
    id: `regulatory-${Date.now()}`,
    rfpId,
    region: 'us',
    productType: 'device',
    items: [
      {
        id: 'check-001',
        category: 'certification',
        requirement: 'FDA 510(k) Clearance',
        applicable: true,
        completed: false,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'check-002',
        category: 'certification',
        requirement: 'ISO 13485 Certification',
        applicable: true,
        completed: false,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'check-003',
        category: 'testing',
        requirement: 'Biocompatibility Testing (ISO 10993)',
        applicable: true,
        completed: false
      }
    ],
    generatedAt: new Date().toISOString(),
    aiGenerated: true
  };
}

function generateProductSpecification(rfpId: string, productData: any): ProductSpecification {
  return {
    id: `product-spec-${Date.now()}`,
    rfpId,
    productName: productData?.name || 'Medical Device',
    category: productData?.category || 'software',
    specifications: {
      'Operating Temperature': '10°C to 40°C',
      'Storage Temperature': '-10°C to 60°C',
      'Humidity': '15% to 85% RH non-condensing',
      'Power Requirements': '100-240V AC, 50/60Hz',
      'Network Connectivity': 'Ethernet, Wi-Fi 802.11ac'
    },
    performanceRequirements: [
      'Response time < 2 seconds for critical functions',
      'Availability 99.9% uptime',
      'Data backup and recovery capabilities',
      'User authentication and access control'
    ],
    materialRequirements: [
      'Biocompatible materials for patient contact surfaces',
      'Flame retardant plastics',
      'Corrosion resistant metals'
    ],
    environmentalConditions: [
      'Hospital/clinical environment usage',
      'Electromagnetic compatibility (EMC)',
      'Electrical safety (IEC 60601-1)'
    ],
    packagingRequirements: [
      'Sterile barrier packaging',
      'Protective packaging for shipping',
      'Clear labeling and instructions'
    ],
    qualityStandards: [
      'ISO 13485',
      'IEC 62304',
      'ISO 14971 (Risk Management)'
    ],
    generatedAt: new Date().toISOString(),
    aiGenerated: true
  };
}

function generateQualityRequirements(rfpId: string, productData: any): QualityRequirement {
  return {
    id: `quality-${Date.now()}`,
    rfpId,
    controlProcesses: [
      'Design Controls (21 CFR 820.30)',
      'Document and Data Controls',
      'Purchasing Controls',
      'Production and Process Controls',
      'Corrective and Preventive Action (CAPA)'
    ],
    testingProtocols: [
      'Design Verification and Validation',
      'Software Testing (unit, integration, system)',
      'Cybersecurity Testing',
      'Usability Testing',
      'Performance Testing'
    ],
    inspectionProcedures: [
      'Incoming Inspection',
      'In-Process Inspection',
      'Final Inspection',
      'Statistical Process Control',
      'Acceptance Criteria Definition'
    ],
    traceabilityRequirements: [
      'Unique Device Identification (UDI)',
      'Component Traceability',
      'Manufacturing Records',
      'Distribution Records',
      'Post-Market Surveillance'
    ],
    documentationRequirements: [
      'Device Master Record (DMR)',
      'Device History Record (DHR)',
      'Quality Manual',
      'Standard Operating Procedures (SOPs)',
      'Risk Management File'
    ],
    qualificationRequirements: [
      'Installation Qualification (IQ)',
      'Operational Qualification (OQ)',
      'Performance Qualification (PQ)',
      'Software Validation',
      'Supplier Qualification'
    ],
    generatedAt: new Date().toISOString(),
    aiGenerated: true
  };
}

function generateSupplierEvaluationMatrix(rfpId: string, requirements: any): SupplierEvaluationMatrix {
  return {
    id: `evaluation-${Date.now()}`,
    rfpId,
    evaluationCriteria: [
      {
        category: 'Technical Capability',
        weight: 40,
        criteria: [
          {
            name: 'Technical Expertise',
            description: 'Demonstrated experience in medical device development',
            maxScore: 100,
            required: true
          },
          {
            name: 'Innovation Capability',
            description: 'Ability to provide innovative solutions',
            maxScore: 100,
            required: false
          }
        ]
      },
      {
        category: 'Compliance & Quality',
        weight: 35,
        criteria: [
          {
            name: 'Regulatory Compliance',
            description: 'Current certifications and compliance status',
            maxScore: 100,
            required: true
          },
          {
            name: 'Quality System',
            description: 'Quality management system maturity',
            maxScore: 100,
            required: true
          }
        ]
      },
      {
        category: 'Commercial',
        weight: 15,
        criteria: [
          {
            name: 'Cost Competitiveness',
            description: 'Total cost of ownership',
            maxScore: 100,
            required: true
          },
          {
            name: 'Payment Terms',
            description: 'Favorable payment and contract terms',
            maxScore: 100,
            required: false
          }
        ]
      },
      {
        category: 'Risk Assessment',
        weight: 10,
        criteria: [
          {
            name: 'Financial Stability',
            description: 'Financial health and stability',
            maxScore: 100,
            required: true
          },
          {
            name: 'Business Continuity',
            description: 'Business continuity planning',
            maxScore: 100,
            required: false
          }
        ]
      }
    ],
    technicalWeighting: 40,
    complianceWeighting: 35,
    commercialWeighting: 15,
    riskWeighting: 10,
    minimumScores: {
      technical: 70,
      compliance: 80,
      overall: 75
    },
    generatedAt: new Date().toISOString(),
    aiGenerated: true
  };
}

function generateResponseTemplate(rfpId: string, requirements: any): ResponseTemplate {
  return {
    id: `template-${Date.now()}`,
    rfpId,
    sections: [
      {
        title: 'Executive Summary',
        description: 'High-level overview of your solution and company',
        required: true,
        format: 'text',
        maxLength: 1000
      },
      {
        title: 'Technical Approach',
        description: 'Detailed technical solution and methodology',
        required: true,
        format: 'text',
        examples: ['Architecture diagrams', 'Technology stack', 'Development methodology']
      },
      {
        title: 'Compliance Documentation',
        description: 'Certifications and compliance evidence',
        required: true,
        format: 'document',
        examples: ['ISO 13485 certificate', 'FDA registration', 'Quality manual']
      },
      {
        title: 'Commercial Proposal',
        description: 'Pricing, timeline, and commercial terms',
        required: true,
        format: 'table'
      },
      {
        title: 'Quality Assurance',
        description: 'Quality processes and testing approach',
        required: true,
        format: 'text'
      },
      {
        title: 'Project Timeline',
        description: 'Detailed project schedule and milestones',
        required: true,
        format: 'table'
      }
    ],
    submissionGuidelines: [
      'Submit all documents in PDF format',
      'Include signed non-disclosure agreement',
      'Provide at least 3 relevant references',
      'Submit by the specified deadline',
      'Follow the exact section structure provided'
    ],
    requiredDocuments: [
      'Company profile and capabilities',
      'Relevant certifications and licenses',
      'Financial statements (last 2 years)',
      'Insurance certificates',
      'Reference letters from previous clients'
    ],
    evaluationCriteria: [
      'Technical merit (40%)',
      'Compliance and quality (35%)',
      'Commercial competitiveness (15%)',
      'Risk assessment (10%)'
    ],
    generatedAt: new Date().toISOString(),
    aiGenerated: true
  };
}

// Helper function to get mock artifact data
async function getMockArtifact(artifactId: string): Promise<RFPArtifact> {
  // This would typically query the database
  // For now, return a mock artifact based on the ID pattern
  const type = artifactId.includes('compliance') ? 'compliance_matrix' :
               artifactId.includes('regulatory') ? 'regulatory_checklist' :
               artifactId.includes('product') ? 'product_specification' :
               artifactId.includes('quality') ? 'quality_requirements' :
               artifactId.includes('evaluation') ? 'supplier_evaluation' :
               'response_templates';
  
  return generateArtifact('mock-rfp-id', type, {}, {});
}

export default router; 