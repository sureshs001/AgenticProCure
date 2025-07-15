import React, { useState } from 'react';
import { RFP, RFPWorkflowStep, RFPArtifact } from '@agentic-procure/shared';
import './RFPCreation.css';

interface RFPCreationProps {}

type WorkflowStep = 'basic_info' | 'product_selection' | 'supplier_discovery' | 'artifact_generation' | 'review' | 'publish';

interface StepData {
  basic_info?: {
    title: string;
    description: string;
    deadline: string;
    budget?: { min?: number; max?: number; currency: string };
  };
  product_selection?: {
    selectedProducts: string[];
    productData: any[];
  };
  supplier_discovery?: {
    selectedSuppliers: string[];
    matchingCriteria: any;
  };
  artifact_generation?: {
    selectedArtifacts: string[];
    generatedArtifacts: RFPArtifact[];
  };
}

const RFPCreation: React.FC<RFPCreationProps> = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('basic_info');
  const [rfpData, setRfpData] = useState<Partial<RFP> | null>(null);
  const [stepData, setStepData] = useState<StepData>({});
  const [loading, setLoading] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<RFPWorkflowStep[]>([
    { step: 'basic_info', status: 'in_progress' },
    { step: 'product_selection', status: 'pending' },
    { step: 'supplier_discovery', status: 'pending' },
    { step: 'artifact_generation', status: 'pending' },
    { step: 'review', status: 'pending' },
    { step: 'publish', status: 'pending' }
  ]);

  const stepTitles = {
    basic_info: 'Basic Information',
    product_selection: 'Product Selection',
    supplier_discovery: 'Supplier Discovery',
    artifact_generation: 'Generate Artifacts',
    review: 'Review & Finalize',
    publish: 'Publish RFP'
  };

  const stepDescriptions = {
    basic_info: 'Set up the basic details of your RFP',
    product_selection: 'Select or add products for this RFP',
    supplier_discovery: 'Find and select potential suppliers',
    artifact_generation: 'Generate RFP documents with AI assistance',
    review: 'Review all information and artifacts',
    publish: 'Publish your RFP to selected suppliers'
  };

  const handleStepComplete = async (step: WorkflowStep, data: any) => {
    setLoading(true);
    
    try {
      // Update step data
      setStepData(prev => ({ ...prev, [step]: data }));
      
      // Update workflow status
      setWorkflowSteps(prev => prev.map(s => 
        s.step === step 
          ? { ...s, status: 'completed', completedAt: new Date().toISOString() }
          : s
      ));
      
      // Move to next step
      const stepOrder: WorkflowStep[] = ['basic_info', 'product_selection', 'supplier_discovery', 'artifact_generation', 'review', 'publish'];
      const currentIndex = stepOrder.indexOf(step);
      if (currentIndex < stepOrder.length - 1) {
        const nextStep = stepOrder[currentIndex + 1];
        setCurrentStep(nextStep);
        setWorkflowSteps(prev => prev.map(s => 
          s.step === nextStep 
            ? { ...s, status: 'in_progress' }
            : s
        ));
      }
      
      // If this is the basic_info step, create the RFP
      if (step === 'basic_info') {
        await createRFP(data);
      }
      
    } catch (error) {
      console.error('Error completing step:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRFP = async (basicInfo: any) => {
    try {
      console.log('Creating RFP with data:', basicInfo);
      const url = 'http://localhost:3001/api/rfps';
      console.log('Making request to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'agentic-procure-dev-key-123'
        },
        body: JSON.stringify(basicInfo)
      });
      
      console.log('Create RFP response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('RFP created successfully:', result);
        setRfpData(result.data);
      } else {
        const errorText = await response.text();
        console.error('Error creating RFP:', errorText);
      }
    } catch (error) {
      console.error('Error creating RFP:', error);
    }
  };

  const generateArtifacts = async (selectedArtifacts: string[]) => {
    // If no RFP data, create a mock one for artifact generation
    let rfpId = rfpData?.id;
    if (!rfpId) {
      console.warn('No RFP ID available, using mock ID for artifact generation');
      rfpId = `mock-rfp-${Date.now()}`;
    }
    
    console.log('Starting artifact generation for RFP:', rfpId);
    console.log('Selected artifacts:', selectedArtifacts);
    
    // For now, create mock artifacts to demonstrate the workflow
    // TODO: Replace with actual API call when backend is stable
    try {
      console.log('Generating mock artifacts...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockArtifacts = selectedArtifacts.map((type, index) => ({
        id: `artifact-${type}-${Date.now()}-${index}`,
        rfpId,
        type,
        name: getArtifactName(type),
        data: generateMockArtifactData(type),
        status: 'generated',
        generatedBy: 'ai',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      console.log('Generated mock artifacts:', mockArtifacts);
      return mockArtifacts;
      
      /* Original API call - uncomment when backend is working
      const url = `http://localhost:3001/api/rfps/${rfpId}/artifacts/generate`;
      console.log('Making request to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'agentic-procure-dev-key-123'
        },
        body: JSON.stringify({
          artifactTypes: selectedArtifacts,
          productData: stepData.product_selection?.productData || [],
          requirements: rfpData?.requirements || []
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Generated artifacts:', result);
        return result.data;
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
      */
    } catch (error) {
      console.error('Error generating artifacts:', error);
    }
    return [];
  };

  const getArtifactName = (type: string): string => {
    switch (type) {
      case 'compliance_matrix': return 'Compliance Requirements Matrix';
      case 'regulatory_checklist': return 'Regulatory Checklist';
      case 'product_specification': return 'Product Specification Sheet';
      case 'quality_requirements': return 'Quality Requirements Document';
      case 'supplier_evaluation': return 'Supplier Evaluation Matrix';
      case 'response_templates': return 'Response Templates';
      default: return `${type} Document`;
    }
  };

  const generateMockArtifactData = (type: string): any => {
    switch (type) {
      case 'compliance_matrix':
        return {
          requirements: [
            { id: 'req-001', standard: 'ISO 13485', requirement: 'Quality Management System', category: 'iso', criticality: 'mandatory', status: 'pending' },
            { id: 'req-002', standard: 'FDA 21 CFR Part 820', requirement: 'Quality System Regulation', category: 'fda', criticality: 'mandatory', status: 'pending' }
          ]
        };
      case 'regulatory_checklist':
        return {
          items: [
            { id: 'check-001', category: 'certification', requirement: 'FDA 510(k) Clearance', applicable: true, completed: false },
            { id: 'check-002', category: 'certification', requirement: 'ISO 13485 Certification', applicable: true, completed: false }
          ]
        };
      default:
        return { mockData: true, type };
    }
  };

  const getStepIcon = (step: WorkflowStep) => {
    const stepStatus = workflowSteps.find(s => s.step === step)?.status;
    switch (stepStatus) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      default: return '⏳';
    }
  };

  const renderStepProgress = () => (
    <div className="step-progress">
      {workflowSteps.map((step, index) => (
        <div key={step.step} className={`step-item ${step.status} ${currentStep === step.step ? 'current' : ''}`}>
          <div className="step-icon">{getStepIcon(step.step)}</div>
          <div className="step-content">
            <div className="step-title">{stepTitles[step.step]}</div>
            <div className="step-description">{stepDescriptions[step.step]}</div>
          </div>
          {index < workflowSteps.length - 1 && <div className="step-connector"></div>}
        </div>
      ))}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basic_info':
        return <BasicInfoStep onComplete={handleStepComplete} />;
      case 'product_selection':
        return <ProductSelectionStep onComplete={handleStepComplete} />;
      case 'supplier_discovery':
        return <SupplierDiscoveryStep onComplete={handleStepComplete} />;
      case 'artifact_generation':
        return <ArtifactGenerationStep onComplete={handleStepComplete} generateArtifacts={generateArtifacts} />;
      case 'review':
        return <ReviewStep rfpData={rfpData} stepData={stepData} onComplete={handleStepComplete} />;
      case 'publish':
        return <PublishStep rfpData={rfpData} onComplete={handleStepComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="rfp-creation">
      <div className="page-header">
        <h1>Create New RFP</h1>
        <p>Follow the guided workflow to create a comprehensive RFP with AI-powered assistance</p>
      </div>

      {renderStepProgress()}

      <div className="step-content">
        {loading && <div className="loading-overlay">Processing...</div>}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

// Step Components
const BasicInfoStep: React.FC<{ onComplete: (step: WorkflowStep, data: any) => void }> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    budget: { min: '', max: '', currency: 'USD' }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      deadline: new Date(formData.deadline).toISOString(),
      budget: {
        min: formData.budget.min ? Number(formData.budget.min) : undefined,
        max: formData.budget.max ? Number(formData.budget.max) : undefined,
        currency: formData.budget.currency
      }
    };
    onComplete('basic_info', data);
  };

  return (
    <div className="step-form">
      <h2>RFP Basic Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">RFP Title *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Medical Device Software Development RFP"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the purpose and scope of this RFP..."
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Response Deadline *</label>
          <input
            type="date"
            id="deadline"
            value={formData.deadline}
            onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group budget-group">
          <label>Budget Range (Optional)</label>
          <div className="budget-inputs">
            <input
              type="number"
              value={formData.budget.min}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                budget: { ...prev.budget, min: e.target.value }
              }))}
              placeholder="Min budget"
            />
            <span>to</span>
            <input
              type="number"
              value={formData.budget.max}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                budget: { ...prev.budget, max: e.target.value }
              }))}
              placeholder="Max budget"
            />
            <select
              value={formData.budget.currency}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                budget: { ...prev.budget, currency: e.target.value }
              }))}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Continue to Product Selection
          </button>
        </div>
      </form>
    </div>
  );
};

const ProductSelectionStep: React.FC<{ onComplete: (step: WorkflowStep, data: any) => void }> = ({ onComplete }) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [availableProducts] = useState([
    { id: 'prod-001', name: 'Cardiovascular Drug Delivery System', category: 'drug' },
    { id: 'prod-002', name: 'Biocompatible Polymer Coating', category: 'material' },
    { id: 'prod-003', name: 'Medical Device Software Platform', category: 'software' },
    { id: 'prod-004', name: 'Sterile Packaging Solution', category: 'packaging' }
  ]);

  const handleContinue = () => {
    const productData = availableProducts.filter(p => selectedProducts.includes(p.id));
    onComplete('product_selection', { selectedProducts, productData });
  };

  return (
    <div className="step-form">
      <h2>Select Products</h2>
      <p>Choose the products that will be included in this RFP</p>

      <div className="product-list">
        {availableProducts.map(product => (
          <div key={product.id} className="product-item">
            <label className="product-checkbox">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProducts(prev => [...prev, product.id]);
                  } else {
                    setSelectedProducts(prev => prev.filter(id => id !== product.id));
                  }
                }}
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <span className="product-category">{product.category}</span>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button 
          className="btn btn-primary" 
          onClick={handleContinue}
          disabled={selectedProducts.length === 0}
        >
          Continue to Supplier Discovery ({selectedProducts.length} products selected)
        </button>
      </div>
    </div>
  );
};

const SupplierDiscoveryStep: React.FC<{ onComplete: (step: WorkflowStep, data: any) => void }> = ({ onComplete }) => {
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [suggestedSuppliers] = useState([
    { id: 'sup-001', name: 'MedTech Solutions Inc.', riskScore: 15, compliance: 'Excellent' },
    { id: 'sup-002', name: 'Pharma Manufacturing Co.', riskScore: 25, compliance: 'Good' },
    { id: 'sup-003', name: 'BioMaterials Ltd.', riskScore: 30, compliance: 'Good' },
    { id: 'sup-004', name: 'Regulatory Specialists', riskScore: 10, compliance: 'Excellent' }
  ]);

  const handleContinue = () => {
    onComplete('supplier_discovery', { selectedSuppliers, matchingCriteria: {} });
  };

  return (
    <div className="step-form">
      <h2>Supplier Discovery</h2>
      <p>AI-suggested suppliers based on your product requirements and compliance needs</p>

      <div className="supplier-list">
        {suggestedSuppliers.map(supplier => (
          <div key={supplier.id} className="supplier-item">
            <label className="supplier-checkbox">
              <input
                type="checkbox"
                checked={selectedSuppliers.includes(supplier.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSuppliers(prev => [...prev, supplier.id]);
                  } else {
                    setSelectedSuppliers(prev => prev.filter(id => id !== supplier.id));
                  }
                }}
              />
              <div className="supplier-info">
                <h3>{supplier.name}</h3>
                <div className="supplier-metrics">
                  <span className={`risk-score ${supplier.riskScore <= 20 ? 'low' : supplier.riskScore <= 40 ? 'medium' : 'high'}`}>
                    Risk Score: {supplier.riskScore}
                  </span>
                  <span className={`compliance ${supplier.compliance.toLowerCase()}`}>
                    Compliance: {supplier.compliance}
                  </span>
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button 
          className="btn btn-primary" 
          onClick={handleContinue}
          disabled={selectedSuppliers.length === 0}
        >
          Continue to Artifact Generation ({selectedSuppliers.length} suppliers selected)
        </button>
      </div>
    </div>
  );
};

const ArtifactGenerationStep: React.FC<{ 
  onComplete: (step: WorkflowStep, data: any) => void;
  generateArtifacts: (selectedArtifacts: string[]) => Promise<RFPArtifact[]>;
}> = ({ onComplete, generateArtifacts }) => {
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([
    'compliance_matrix',
    'regulatory_checklist',
    'product_specification',
    'quality_requirements',
    'supplier_evaluation',
    'response_templates'
  ]);
  const [generatedArtifacts, setGeneratedArtifacts] = useState<RFPArtifact[]>([]);
  const [generating, setGenerating] = useState(false);

  const artifactOptions = [
    { id: 'compliance_matrix', name: 'Compliance Requirements Matrix', description: 'Detailed compliance requirements and standards' },
    { id: 'regulatory_checklist', name: 'Regulatory Checklist', description: 'Region-specific regulatory requirements' },
    { id: 'product_specification', name: 'Product Specification Sheet', description: 'Technical specifications and requirements' },
    { id: 'quality_requirements', name: 'Quality Requirements Document', description: 'Quality processes and testing protocols' },
    { id: 'supplier_evaluation', name: 'Supplier Evaluation Matrix', description: 'Criteria for evaluating supplier responses' },
    { id: 'response_templates', name: 'Response Templates', description: 'Standardized templates for supplier responses' }
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const artifacts = await generateArtifacts(selectedArtifacts);
      setGeneratedArtifacts(artifacts);
    } catch (error) {
      console.error('Error generating artifacts:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleContinue = () => {
    onComplete('artifact_generation', { selectedArtifacts, generatedArtifacts });
  };

  return (
    <div className="step-form">
      <h2>Generate RFP Artifacts</h2>
      <p>Select the documents you want to generate with AI assistance</p>

      <div className="artifact-selection">
        {artifactOptions.map(artifact => (
          <div key={artifact.id} className="artifact-item">
            <label className="artifact-checkbox">
              <input
                type="checkbox"
                checked={selectedArtifacts.includes(artifact.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedArtifacts(prev => [...prev, artifact.id]);
                  } else {
                    setSelectedArtifacts(prev => prev.filter(id => id !== artifact.id));
                  }
                }}
              />
              <div className="artifact-info">
                <h3>{artifact.name}</h3>
                <p>{artifact.description}</p>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="generation-section">
        {(generatedArtifacts || []).length === 0 ? (
          <button 
            className="btn btn-primary btn-large"
            onClick={handleGenerate}
            disabled={selectedArtifacts.length === 0 || generating}
          >
            {generating ? 'Generating Artifacts...' : `Generate ${selectedArtifacts.length} Artifacts with AI`}
          </button>
        ) : (
          <div className="generated-artifacts">
            <h3>Generated Artifacts ({(generatedArtifacts || []).length})</h3>
            <div className="artifact-list">
              {(generatedArtifacts || []).map(artifact => (
                <div key={artifact.id} className="generated-artifact">
                  <span className="artifact-icon">📄</span>
                  <span className="artifact-name">{artifact.name}</span>
                  <span className="artifact-status">✅ Generated</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={handleContinue}>
              Continue to Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewStep: React.FC<{ 
  rfpData: Partial<RFP> | null;
  stepData: StepData;
  onComplete: (step: WorkflowStep, data: any) => void;
}> = ({ rfpData, stepData, onComplete }) => {
  return (
    <div className="step-form">
      <h2>Review & Finalize</h2>
      <p>Review all RFP information before publishing</p>

      <div className="review-sections">
        <div className="review-section">
          <h3>Basic Information</h3>
          <div className="review-content">
            <p><strong>Title:</strong> {stepData.basic_info?.title}</p>
            <p><strong>Description:</strong> {stepData.basic_info?.description}</p>
            <p><strong>Deadline:</strong> {stepData.basic_info?.deadline}</p>
          </div>
        </div>

        <div className="review-section">
          <h3>Selected Products</h3>
          <div className="review-content">
            <p>{stepData.product_selection?.selectedProducts.length || 0} products selected</p>
          </div>
        </div>

        <div className="review-section">
          <h3>Selected Suppliers</h3>
          <div className="review-content">
            <p>{stepData.supplier_discovery?.selectedSuppliers.length || 0} suppliers selected</p>
          </div>
        </div>

        <div className="review-section">
          <h3>Generated Artifacts</h3>
          <div className="review-content">
            <p>{stepData.artifact_generation?.generatedArtifacts.length || 0} artifacts generated</p>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button 
          className="btn btn-primary"
          onClick={() => onComplete('review', {})}
        >
          Proceed to Publish
        </button>
      </div>
    </div>
  );
};

const PublishStep: React.FC<{ 
  rfpData: Partial<RFP> | null;
  onComplete: (step: WorkflowStep, data: any) => void;
}> = ({ rfpData, onComplete }) => {
  const [publishOptions, setPublishOptions] = useState({
    notifySuppliers: true,
    sendReminders: true,
    allowQuestions: true
  });

  const handlePublish = () => {
    onComplete('publish', { publishOptions, publishedAt: new Date().toISOString() });
  };

  return (
    <div className="step-form">
      <h2>Publish RFP</h2>
      <p>Configure publication settings and send to selected suppliers</p>

      <div className="publish-options">
        <label className="option-checkbox">
          <input
            type="checkbox"
            checked={publishOptions.notifySuppliers}
            onChange={(e) => setPublishOptions(prev => ({ ...prev, notifySuppliers: e.target.checked }))}
          />
          Send email notifications to suppliers
        </label>

        <label className="option-checkbox">
          <input
            type="checkbox"
            checked={publishOptions.sendReminders}
            onChange={(e) => setPublishOptions(prev => ({ ...prev, sendReminders: e.target.checked }))}
          />
          Send deadline reminders
        </label>

        <label className="option-checkbox">
          <input
            type="checkbox"
            checked={publishOptions.allowQuestions}
            onChange={(e) => setPublishOptions(prev => ({ ...prev, allowQuestions: e.target.checked }))}
          />
          Allow suppliers to ask questions
        </label>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary btn-large" onClick={handlePublish}>
          🚀 Publish RFP
        </button>
      </div>
    </div>
  );
};

export default RFPCreation;