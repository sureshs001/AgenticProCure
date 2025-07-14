// Application constants
export const APP_NAME = 'Agentic ProCURE';
export const APP_VERSION = '1.0.0';

// AWS Configuration
export const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
export const AWS_BEDROCK_MODEL = process.env.AWS_BEDROCK_MODEL || 'anthropic.claude-3-sonnet-20240229-v1:0';

// Agent Types
export const AGENT_TYPES = {
  COMPLIANCE: 'compliance',
  PRODUCT_REQUIREMENTS: 'product_requirements',
  SUPPLIER_INTELLIGENCE: 'supplier_intelligence',
  GENERAL: 'general',
} as const;

// Compliance Standards
export const COMPLIANCE_STANDARDS = {
  ISO_13485: 'ISO 13485',
  ISO_14971: 'ISO 14971',
  FDA_21_CFR_820: 'FDA 21 CFR 820',
  FDA_21_CFR_211: 'FDA 21 CFR 211',
  CE_MDR: 'CE MDR',
  CE_IVDR: 'CE IVDR',
  USP: 'USP',
  EP: 'EP',
  JP: 'JP',
} as const;

// Product Categories
export const PRODUCT_CATEGORIES = {
  DRUG: 'drug',
  MATERIAL: 'material',
  COMPOSITE: 'composite',
  PLASTIC: 'plastic',
  PACKAGING: 'packaging',
  SOFTWARE: 'software',
} as const;

// Industry Types
export const INDUSTRY_TYPES = {
  PHARMA: 'pharma',
  MEDTECH: 'medtech',
  SOFTWARE: 'software',
  PACKAGING: 'packaging',
  MATERIALS: 'materials',
} as const;

// RFP Status
export const RFP_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  EVALUATING: 'evaluating',
  AWARDED: 'awarded',
  CLOSED: 'closed',
} as const;

// Alert Types
export const ALERT_TYPES = {
  COMPLIANCE_RISK: 'compliance_risk',
  SUPPLIER_UPDATE: 'supplier_update',
  DEADLINE_APPROACHING: 'deadline_approaching',
  NEW_REQUIREMENT: 'new_requirement',
} as const;

// Alert Severity
export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  PROCUREMENT_MANAGER: 'procurement_manager',
  COMPLIANCE_OFFICER: 'compliance_officer',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Agents
  AGENTS: '/api/agents',
  AGENT_CHAT: '/api/agents/chat',
  AGENT_CONFIG: '/api/agents/config',
  
  // Compliance
  COMPLIANCE_DASHBOARD: '/api/compliance/dashboard',
  COMPLIANCE_ALERTS: '/api/compliance/alerts',
  COMPLIANCE_STANDARDS: '/api/compliance/standards',
  SUPPLIERS: '/api/suppliers',
  
  // Product Requirements
  PRODUCT_REQUIREMENTS: '/api/product-requirements',
  PRODUCT_REQUIREMENTS_DASHBOARD: '/api/product-requirements/dashboard',
  UPLOAD_DOCUMENT: '/api/product-requirements/upload',
  
  // RFP
  RFPS: '/api/rfps',
  RFP_DASHBOARD: '/api/rfps/dashboard',
  RFP_ARTIFACTS: '/api/rfps/artifacts',
  
  // Users
  USERS: '/api/users',
  AUTH: '/api/auth',
} as const;

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'],
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Agent Configuration
export const AGENT_CONFIG = {
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_MAX_TOKENS: 4000,
  CONFIDENCE_THRESHOLD: 0.8,
  MAX_SOURCES: 5,
} as const;

// Scheduled Tasks
export const SCHEDULED_TASKS = {
  COMPLIANCE_MONITORING: '0 */6 * * *', // Every 6 hours
  SUPPLIER_RISK_ASSESSMENT: '0 2 * * *', // Daily at 2 AM
  ALERT_GENERATION: '0 */4 * * *', // Every 4 hours
} as const;

// Sample Data for MVP
export const SAMPLE_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Injectable Drug Product',
    category: PRODUCT_CATEGORIES.DRUG,
    description: 'Sterile injectable drug product for cardiovascular treatment',
    complianceRequirements: [COMPLIANCE_STANDARDS.FDA_21_CFR_211, COMPLIANCE_STANDARDS.USP],
    industry: INDUSTRY_TYPES.PHARMA,
  },
  {
    id: 'prod-002',
    name: 'Medical Device Software',
    category: PRODUCT_CATEGORIES.SOFTWARE,
    description: 'Software as Medical Device (SaMD) for diagnostic imaging',
    complianceRequirements: [COMPLIANCE_STANDARDS.FDA_21_CFR_820, COMPLIANCE_STANDARDS.ISO_13485],
    industry: INDUSTRY_TYPES.MEDTECH,
  },
  {
    id: 'prod-003',
    name: 'Pharmaceutical Packaging Material',
    category: PRODUCT_CATEGORIES.PACKAGING,
    description: 'Child-resistant packaging material for oral solid dosage forms',
    complianceRequirements: [COMPLIANCE_STANDARDS.ISO_13485, COMPLIANCE_STANDARDS.FDA_21_CFR_211],
    industry: INDUSTRY_TYPES.PACKAGING,
  },
] as const;

export const SAMPLE_SUPPLIERS = [
  {
    id: 'supp-001',
    name: 'PharmaCorp Solutions',
    industry: INDUSTRY_TYPES.PHARMA,
    complianceStandards: [COMPLIANCE_STANDARDS.FDA_21_CFR_211, COMPLIANCE_STANDARDS.ISO_13485],
    riskScore: 15,
    status: 'active',
  },
  {
    id: 'supp-002',
    name: 'MedTech Innovations',
    industry: INDUSTRY_TYPES.MEDTECH,
    complianceStandards: [COMPLIANCE_STANDARDS.ISO_13485, COMPLIANCE_STANDARDS.CE_MDR],
    riskScore: 25,
    status: 'active',
  },
  {
    id: 'supp-003',
    name: 'PackagingPro Ltd',
    industry: INDUSTRY_TYPES.PACKAGING,
    complianceStandards: [COMPLIANCE_STANDARDS.ISO_13485],
    riskScore: 35,
    status: 'pending_review',
  },
] as const; 