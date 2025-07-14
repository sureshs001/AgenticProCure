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

export const RFPSchema = BaseEntitySchema.extend({
  title: z.string(),
  description: z.string(),
  products: z.array(z.string()), // Product IDs
  suppliers: z.array(z.string()), // Supplier IDs
  status: z.enum(['draft', 'published', 'evaluating', 'awarded', 'closed']),
  deadline: z.string().datetime(),
  requirements: z.array(z.string()),
  artifacts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['compliance', 'technical', 'commercial']),
    url: z.string().url(),
  })),
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