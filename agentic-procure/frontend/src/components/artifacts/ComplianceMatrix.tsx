import React, { useState, useEffect } from 'react';
import { ComplianceMatrix, ComplianceRequirementItem } from '@agentic-procure/shared';
import './ComplianceMatrix.css';

interface ComplianceMatrixProps {
  rfpId: string;
  data?: ComplianceMatrix;
  editable?: boolean;
  onUpdate?: (data: ComplianceMatrix) => void;
}

const ComplianceMatrixComponent: React.FC<ComplianceMatrixProps> = ({
  rfpId,
  data,
  editable = false,
  onUpdate
}) => {
  const [matrixData, setMatrixData] = useState<ComplianceMatrix>(
    data || {
      id: `compliance-${Date.now()}`,
      rfpId,
      productCategories: [],
      requirements: [],
      generatedAt: new Date().toISOString(),
      aiGenerated: false
    }
  );

  const [editingRequirement, setEditingRequirement] = useState<string | null>(null);
  const [newRequirement, setNewRequirement] = useState<Partial<ComplianceRequirementItem>>({});

  useEffect(() => {
    if (data) {
      setMatrixData(data);
    }
  }, [data]);

  const handleRequirementUpdate = (id: string, updates: Partial<ComplianceRequirementItem>) => {
    const updatedRequirements = matrixData.requirements.map(req =>
      req.id === id ? { ...req, ...updates } : req
    );
    
    const updatedMatrix = {
      ...matrixData,
      requirements: updatedRequirements
    };
    
    setMatrixData(updatedMatrix);
    if (onUpdate) {
      onUpdate(updatedMatrix);
    }
  };

  const handleAddRequirement = () => {
    if (!newRequirement.standard || !newRequirement.requirement) return;

    const requirement: ComplianceRequirementItem = {
      id: `req-${Date.now()}`,
      standard: newRequirement.standard || '',
      requirement: newRequirement.requirement || '',
      category: newRequirement.category || 'other',
      criticality: newRequirement.criticality || 'mandatory',
      evidence: newRequirement.evidence || '',
      status: 'pending'
    };

    const updatedMatrix = {
      ...matrixData,
      requirements: [...matrixData.requirements, requirement]
    };

    setMatrixData(updatedMatrix);
    setNewRequirement({});
    if (onUpdate) {
      onUpdate(updatedMatrix);
    }
  };

  const handleRemoveRequirement = (id: string) => {
    const updatedMatrix = {
      ...matrixData,
      requirements: matrixData.requirements.filter(req => req.id !== id)
    };
    
    setMatrixData(updatedMatrix);
    if (onUpdate) {
      onUpdate(updatedMatrix);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'iso': return '🏆';
      case 'fda': return '🏛️';
      case 'ce': return '🇪🇺';
      default: return '📋';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'mandatory': return '#e74c3c';
      case 'recommended': return '#f39c12';
      case 'optional': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return '✅';
      case 'pending': return '⏳';
      case 'not_applicable': return '❌';
      default: return '⏳';
    }
  };

  const exportToCSV = () => {
    const headers = ['Standard', 'Requirement', 'Category', 'Criticality', 'Evidence', 'Status'];
    const rows = matrixData.requirements.map(req => [
      req.standard,
      req.requirement,
      req.category,
      req.criticality,
      req.evidence,
      req.status
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-matrix-${rfpId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="compliance-matrix">
      <div className="matrix-header">
        <div className="header-content">
          <h2>Compliance Requirements Matrix</h2>
          <div className="header-info">
            {matrixData.aiGenerated && (
              <span className="ai-badge">🤖 AI Generated</span>
            )}
            <span className="requirement-count">
              {matrixData.requirements.length} Requirements
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={exportToCSV}>
            📊 Export CSV
          </button>
          {editable && (
            <button 
              className="btn btn-primary"
              onClick={() => setEditingRequirement('new')}
            >
              ➕ Add Requirement
            </button>
          )}
        </div>
      </div>

      {/* Product Categories */}
      {matrixData.productCategories.length > 0 && (
        <div className="product-categories">
          <h3>Product Categories</h3>
          <div className="category-tags">
            {matrixData.productCategories.map(category => (
              <span key={category} className="category-tag">
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Requirements Table */}
      <div className="requirements-table">
        <div className="table-header">
          <div className="col-standard">Standard</div>
          <div className="col-requirement">Requirement</div>
          <div className="col-category">Category</div>
          <div className="col-criticality">Criticality</div>
          <div className="col-evidence">Evidence Required</div>
          <div className="col-status">Status</div>
          {editable && <div className="col-actions">Actions</div>}
        </div>

        <div className="table-body">
          {matrixData.requirements.map(requirement => (
            <RequirementRow
              key={requirement.id}
              requirement={requirement}
              editable={editable}
              isEditing={editingRequirement === requirement.id}
              onEdit={() => setEditingRequirement(requirement.id)}
              onSave={(updates) => {
                handleRequirementUpdate(requirement.id, updates);
                setEditingRequirement(null);
              }}
              onCancel={() => setEditingRequirement(null)}
              onDelete={() => handleRemoveRequirement(requirement.id)}
              getCategoryIcon={getCategoryIcon}
              getCriticalityColor={getCriticalityColor}
              getStatusIcon={getStatusIcon}
            />
          ))}

          {/* Add New Requirement Row */}
          {editingRequirement === 'new' && (
            <div className="table-row new-requirement-row">
              <div className="col-standard">
                <input
                  type="text"
                  value={newRequirement.standard || ''}
                  onChange={(e) => setNewRequirement(prev => ({ ...prev, standard: e.target.value }))}
                  placeholder="e.g., ISO 13485"
                />
              </div>
              <div className="col-requirement">
                <input
                  type="text"
                  value={newRequirement.requirement || ''}
                  onChange={(e) => setNewRequirement(prev => ({ ...prev, requirement: e.target.value }))}
                  placeholder="Requirement description"
                />
              </div>
              <div className="col-category">
                <select
                  value={newRequirement.category || 'other'}
                  onChange={(e) => setNewRequirement(prev => ({ ...prev, category: e.target.value as any }))}
                >
                  <option value="iso">ISO</option>
                  <option value="fda">FDA</option>
                  <option value="ce">CE</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-criticality">
                <select
                  value={newRequirement.criticality || 'mandatory'}
                  onChange={(e) => setNewRequirement(prev => ({ ...prev, criticality: e.target.value as any }))}
                >
                  <option value="mandatory">Mandatory</option>
                  <option value="recommended">Recommended</option>
                  <option value="optional">Optional</option>
                </select>
              </div>
              <div className="col-evidence">
                <input
                  type="text"
                  value={newRequirement.evidence || ''}
                  onChange={(e) => setNewRequirement(prev => ({ ...prev, evidence: e.target.value }))}
                  placeholder="Evidence required"
                />
              </div>
              <div className="col-status">
                <span className="status-badge pending">Pending</span>
              </div>
              <div className="col-actions">
                <button className="btn-icon btn-save" onClick={handleAddRequirement}>
                  ✅
                </button>
                <button 
                  className="btn-icon btn-cancel" 
                  onClick={() => {
                    setEditingRequirement(null);
                    setNewRequirement({});
                  }}
                >
                  ❌
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="matrix-summary">
        <div className="summary-card">
          <h4>Mandatory Requirements</h4>
          <div className="summary-value">
            {matrixData.requirements.filter(r => r.criticality === 'mandatory').length}
          </div>
        </div>
        <div className="summary-card">
          <h4>Verified Requirements</h4>
          <div className="summary-value">
            {matrixData.requirements.filter(r => r.status === 'verified').length}
          </div>
        </div>
        <div className="summary-card">
          <h4>Pending Verification</h4>
          <div className="summary-value">
            {matrixData.requirements.filter(r => r.status === 'pending').length}
          </div>
        </div>
        <div className="summary-card">
          <h4>Completion Rate</h4>
          <div className="summary-value">
            {matrixData.requirements.length > 0 
              ? Math.round((matrixData.requirements.filter(r => r.status === 'verified').length / matrixData.requirements.length) * 100)
              : 0}%
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual Requirement Row Component
const RequirementRow: React.FC<{
  requirement: ComplianceRequirementItem;
  editable: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<ComplianceRequirementItem>) => void;
  onCancel: () => void;
  onDelete: () => void;
  getCategoryIcon: (category: string) => string;
  getCriticalityColor: (criticality: string) => string;
  getStatusIcon: (status: string) => string;
}> = ({
  requirement,
  editable,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  getCategoryIcon,
  getCriticalityColor,
  getStatusIcon
}) => {
  const [editData, setEditData] = useState(requirement);

  useEffect(() => {
    setEditData(requirement);
  }, [requirement]);

  if (isEditing && editable) {
    return (
      <div className="table-row editing">
        <div className="col-standard">
          <input
            type="text"
            value={editData.standard}
            onChange={(e) => setEditData(prev => ({ ...prev, standard: e.target.value }))}
          />
        </div>
        <div className="col-requirement">
          <input
            type="text"
            value={editData.requirement}
            onChange={(e) => setEditData(prev => ({ ...prev, requirement: e.target.value }))}
          />
        </div>
        <div className="col-category">
          <select
            value={editData.category}
            onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value as any }))}
          >
            <option value="iso">ISO</option>
            <option value="fda">FDA</option>
            <option value="ce">CE</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-criticality">
          <select
            value={editData.criticality}
            onChange={(e) => setEditData(prev => ({ ...prev, criticality: e.target.value as any }))}
          >
            <option value="mandatory">Mandatory</option>
            <option value="recommended">Recommended</option>
            <option value="optional">Optional</option>
          </select>
        </div>
        <div className="col-evidence">
          <input
            type="text"
            value={editData.evidence}
            onChange={(e) => setEditData(prev => ({ ...prev, evidence: e.target.value }))}
          />
        </div>
        <div className="col-status">
          <select
            value={editData.status}
            onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as any }))}
          >
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="not_applicable">Not Applicable</option>
          </select>
        </div>
        <div className="col-actions">
          <button className="btn-icon btn-save" onClick={() => onSave(editData)}>
            ✅
          </button>
          <button className="btn-icon btn-cancel" onClick={onCancel}>
            ❌
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="table-row">
      <div className="col-standard">
        <span className="category-icon">{getCategoryIcon(requirement.category)}</span>
        {requirement.standard}
      </div>
      <div className="col-requirement">
        {requirement.requirement}
      </div>
      <div className="col-category">
        <span className="category-badge">{requirement.category.toUpperCase()}</span>
      </div>
      <div className="col-criticality">
        <span 
          className="criticality-badge"
          style={{ backgroundColor: getCriticalityColor(requirement.criticality) }}
        >
          {requirement.criticality}
        </span>
      </div>
      <div className="col-evidence">
        {requirement.evidence}
      </div>
      <div className="col-status">
        <span className={`status-badge ${requirement.status}`}>
          {getStatusIcon(requirement.status)} {requirement.status}
        </span>
      </div>
      {editable && (
        <div className="col-actions">
          <button className="btn-icon btn-edit" onClick={onEdit}>
            ✏️
          </button>
          <button className="btn-icon btn-delete" onClick={onDelete}>
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplianceMatrixComponent;