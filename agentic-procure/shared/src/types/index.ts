import { z } from 'zod';

// Base schemas
export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UserSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'procurement_manager', 'compliance_officer']),
  organization: z.string(),
});

export const SupplierSchema = BaseEntitySchema.extend({
  name: z.string(),
  industry: z.enum(['pharma', 'medtech', 'software', 'packaging', 'materials']),
  complianceStandards: z.array(z.string()),
  riskScore: z.number().min(0).max(100),
  lastAssessmentDate: z.string().datetime().optional(),
  status: z.enum(['active', 'suspended', 'pending_review']),
  contactInfo: z.object({
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
  }),
});

export const ComplianceStandardSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['iso', 'fda', 'ce', 'other']),
  version: z.string(),
  effectiveDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
});

export const ProductRequirementSchema = BaseEntitySchema.extend({
  name: z.string(),
  description: z.string(),
  category: z.enum(['drug', 'material', 'composite', 'plastic', 'packaging', 'software']),
  complianceRequirements: z.array(z.string()),
  technicalSpecifications: z.record(z.any()),
  guidanceDocuments: z.array(z.string()),
  riskFactors: z.array(z.string()),
});

// RFP Artifact Schemas
export const ComplianceRequirementItemSchema = z.object({
  id: z.string(),
  standard: z.string(),
  requirement: z.string(),
  category: z.enum(['iso', 'fda', 'ce', 'other']),
  criticality: z.enum(['mandatory', 'recommended', 'optional']),
  evidence: z.string(),
  status: z.enum(['pending', 'verified', 'not_applicable']),
});

export const ComplianceMatrixSchema = z.object({
  id: z.string(),
  rfpId: z.string(),
  productCategories: z.array(z.string()),
  requirements: z.array(ComplianceRequirementItemSchema),
  generatedAt: z.string().datetime(),
  aiGenerated: z.boolean(),
});

export const RegulatoryChecklistItemSchema = z.object({
  id: z.string(),
  category: z.enum(['certification', 'documentation', 'testing', 'quality_system']),
  requirement: z.string(),
  applicable: z.boolean(),
  completed: z.boolean(),
  evidence: z.string().optional(),
  deadline: z.string().datetime().optional(),
});

export const RegulatoryChecklistSchema = z.object({
  id: z.string(),
  rfpId: z.string(),
  region: z.enum(['us', 'eu', 'global']),
  productType: z.enum(['drug', 'device', 'software', 'combination']),
  items: z.array(RegulatoryChecklistItemSchema),
  generatedAt: z.string().datetime(),
  aiGenerated: z.boolean(),
});

export const ProductSpecificationSchema = z.object({
  id: z.string(),
  rfpId: z.string(),
  productName: z.string(),
  category: z.enum(['drug', 'material', 'composite', 'plastic', 'packaging', 'software']),
  specifications: z.record(z.any()),
  performanceRequirements: z.array(z.string()),
  materialRequirements: z.array(z.string()),
  environmentalConditions: z.array(z.string()),
  packagingRequirements: z.array(z.string()),
  qualityStandards: z.array(z.string()),
  generatedAt: z.string().datetime(),
  aiGenerated: z.boolean(),
});

export const QualityRequirementSchema = z.object({
  id: z.string(),
  rfpId: z.string(),
  controlProcesses: z.array(z.string()),
  testingProtocols: z.array(z.string()),
  inspectionProcedures: z.array(z.string()),
  traceabilityRequirements: z.array(z.string()),
  documentationRequirements: z.array(z.string()),
  qualificationRequirements: z.array(z.string()),
  generatedAt: z.string().datetime(),
  aiGenerated: z.boolean(),
});

export const EvaluationCriteriaSchema = z.object({
  category: z.string(),
  weight: z.number().min(0).max(100),
  criteria: z.array(z.object({
    name: z.string(),
    description: z.string(),
    maxScore: z.number(),
    required: z.boolean(),
  })),
});

export const SupplierEvaluationMatrixSchema = z.object({
  id: z.string(),
  rfpId: z.string(),
  evaluationCriteria: z.array(EvaluationCriteriaSchema),
  technicalWeighting: z.number(),
  complianceWeighting: z.number(),
  commercialWeighting: z.number(),
  riskWeighting: z.number(),
  minimumScores: z.object({
    technical: z.number(),
    compliance: z.number(),
    overall: z.number(),
  }),
  generatedAt: z.string().datetime(),
  aiGenerated: z.boolean(),
});

export const ResponseTemplateSchema = z.object({
  id: z.string(),
  rfpId: z.string(),
  sections: z.array(z.object({
    title: z.string(),
    description: z.string(),
    required: z.boolean(),
    format: z.enum(['text', 'table', 'document', 'certification']),
    maxLength: z.number().optional(),
    examples: z.array(z.string()).optional(),
  })),
  submissionGuidelines: z.array(z.string()),
  requiredDocuments: z.array(z.string()),
  evaluationCriteria: z.array(z.string()),
  generatedAt: z.string().datetime(),
  aiGenerated: z.boolean(),
});

export const RFPArtifactSchema = z.object({
  id: z.string(),
  rfpId: z.string(),
  type: z.enum(['compliance_matrix', 'regulatory_checklist', 'product_specification', 'quality_requirements', 'supplier_evaluation', 'response_templates']),
  name: z.string(),
  data: z.any(), // Will be one of the specific artifact schemas above
  status: z.enum(['draft', 'generated', 'reviewed', 'approved']),
  generatedBy: z.enum(['ai', 'user', 'template']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const RFPWorkflowStepSchema = z.object({
  step: z.enum(['basic_info', 'product_selection', 'supplier_discovery', 'artifact_generation', 'review', 'publish']),
  status: z.enum(['pending', 'in_progress', 'completed', 'skipped']),
  completedAt: z.string().datetime().optional(),
  data: z.record(z.any()).optional(),
});

export const RFPSchema = BaseEntitySchema.extend({
  title: z.string(),
  description: z.string(),
  products: z.array(z.string()), // Product IDs
  suppliers: z.array(z.string()), // Supplier IDs
  status: z.enum(['draft', 'published', 'evaluating', 'awarded', 'closed']),
  deadline: z.string().datetime(),
  requirements: z.array(z.string()),
  workflowStatus: z.array(RFPWorkflowStepSchema),
  artifacts: z.array(RFPArtifactSchema),
  budget: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().default('USD'),
  }).optional(),
  timeline: z.object({
    rfpPublished: z.string().datetime().optional(),
    responseDeadline: z.string().datetime(),
    evaluationComplete: z.string().datetime().optional(),
    awardDate: z.string().datetime().optional(),
  }),
});

export const AgentResponseSchema = z.object({
  id: z.string().uuid(),
  agentType: z.enum(['compliance', 'product_requirements', 'supplier_intelligence', 'general']),
  query: z.string(),
  response: z.string(),
  confidence: z.number().min(0).max(1),
  sources: z.array(z.string()),
  timestamp: z.string().datetime(),
});

export const AlertSchema = BaseEntitySchema.extend({
  type: z.enum(['compliance_risk', 'supplier_update', 'deadline_approaching', 'new_requirement']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string(),
  message: z.string(),
  relatedEntities: z.array(z.string()),
  isRead: z.boolean(),
  actionRequired: z.boolean(),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type Supplier = z.infer<typeof SupplierSchema>;
export type ComplianceStandard = z.infer<typeof ComplianceStandardSchema>;
export type ProductRequirement = z.infer<typeof ProductRequirementSchema>;
export type RFP = z.infer<typeof RFPSchema>;
export type AgentResponse = z.infer<typeof AgentResponseSchema>;
export type Alert = z.infer<typeof AlertSchema>;

// RFP Artifact Types
export type ComplianceRequirementItem = z.infer<typeof ComplianceRequirementItemSchema>;
export type ComplianceMatrix = z.infer<typeof ComplianceMatrixSchema>;
export type RegulatoryChecklistItem = z.infer<typeof RegulatoryChecklistItemSchema>;
export type RegulatoryChecklist = z.infer<typeof RegulatoryChecklistSchema>;
export type ProductSpecification = z.infer<typeof ProductSpecificationSchema>;
export type QualityRequirement = z.infer<typeof QualityRequirementSchema>;
export type EvaluationCriteria = z.infer<typeof EvaluationCriteriaSchema>;
export type SupplierEvaluationMatrix = z.infer<typeof SupplierEvaluationMatrixSchema>;
export type ResponseTemplate = z.infer<typeof ResponseTemplateSchema>;
export type RFPArtifact = z.infer<typeof RFPArtifactSchema>;
export type RFPWorkflowStep = z.infer<typeof RFPWorkflowStepSchema>;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Agent-specific types
export interface AgentConfig {
  id: string;
  name: string;
  type: 'compliance' | 'product_requirements' | 'supplier_intelligence' | 'general';
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  tools: string[];
  schedule?: string; // Cron expression for scheduled agents
}

export interface AgentContext {
  userId: string;
  organization: string;
  currentScreen: string;
  sessionData: Record<string, any>;
}

export interface AgentRequest {
  query: string;
  context: AgentContext;
  agentType: string;
  options?: {
    includeSources?: boolean;
    maxResults?: number;
    confidence?: number;
  };
}

// Dashboard types
export interface ComplianceDashboard {
  totalSuppliers: number;
  compliantSuppliers: number;
  atRiskSuppliers: number;
  recentAlerts: Alert[];
  upcomingDeadlines: ComplianceStandard[];
  riskTrends: Array<{
    date: string;
    riskScore: number;
  }>;
}

export interface ProductRequirementsDashboard {
  totalProducts: number;
  productsByCategory: Record<string, number>;
  recentUploads: ProductRequirement[];
  popularSearches: string[];
  complianceGaps: Array<{
    productId: string;
    missingStandards: string[];
  }>;
}

export interface RFPDashboard {
  activeRFPs: number;
  draftRFPs: number;
  completedRFPs: number;
  recentRFPs: RFP[];
  upcomingDeadlines: RFP[];
  supplierResponses: Array<{
    rfpId: string;
    supplierId: string;
    status: 'pending' | 'submitted' | 'evaluated';
    submittedAt?: string;
  }>;
} 