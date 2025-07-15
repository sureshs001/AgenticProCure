import React, { useState } from 'react';
import { 
  UploadIcon, 
  DocumentIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon,
  ClipboardListIcon,
  SearchIcon,
  PlusIcon,
  ExternalLinkIcon
} from '../components/Icons';
import './ProductRequirements.css';

const ProductRequirements: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const sampleProducts = [
    {
      id: 'prod-001',
      name: 'Injectable Drug Product',
      category: 'Drug Product',
      description: 'Sterile injectable drug product for cardiovascular treatment with sustained release formulation',
      complianceRequirements: ['FDA 21 CFR 211', 'USP <1>'],
      status: 'active',
      lastUpdated: '2024-01-10',
      documents: 3,
      riskLevel: 'low',
    },
    {
      id: 'prod-002',
      name: 'Medical Device Software',
      category: 'Software',
      description: 'Software as Medical Device (SaMD) for diagnostic imaging and AI-powered analysis',
      complianceRequirements: ['FDA 21 CFR 820', 'ISO 13485', 'IEC 62304'],
      status: 'active',
      lastUpdated: '2024-01-08',
      documents: 5,
      riskLevel: 'medium',
    },
    {
      id: 'prod-003',
      name: 'Pharmaceutical Packaging Material',
      category: 'Packaging',
      description: 'Child-resistant packaging material for oral solid dosage forms with tamper-evident features',
      complianceRequirements: ['ISO 13485', 'FDA 21 CFR 211', 'USP <661>'],
      status: 'pending',
      lastUpdated: '2024-01-05',
      documents: 2,
      riskLevel: 'high',
    },
    {
      id: 'prod-004',
      name: 'Biocompatible Implant Material',
      category: 'Medical Device',
      description: 'Titanium alloy implant material for orthopedic applications',
      complianceRequirements: ['ISO 13485', 'ISO 10993', 'ASTM F136'],
      status: 'active',
      lastUpdated: '2024-01-12',
      documents: 4,
      riskLevel: 'medium',
    },
  ];

  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircleIcon;
      case 'pending': return AlertTriangleIcon;
      default: return ClipboardListIcon;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'var(--error-500)';
      case 'medium': return 'var(--warning-500)';
      case 'low': return 'var(--success-500)';
      default: return 'var(--neutral-500)';
    }
  };

  return (
    <div className="product-requirements">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Product Requirements Repository</h1>
            <p className="page-subtitle">
              Upload and manage product requirement documents with AI-powered analysis and compliance tracking
            </p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <ExternalLinkIcon size={18} />
              Export All
            </button>
            <button className="btn btn-primary">
              <PlusIcon size={18} />
              New Requirement
            </button>
          </div>
        </div>
      </div>

      <div className="upload-section">
        <div className="upload-card">
          <div className="upload-header">
            <div className="upload-icon-wrapper">
              <UploadIcon size={32} />
            </div>
            <div className="upload-title">
              <h2>Upload Requirements Document</h2>
              <p>Drag and drop files or click to browse</p>
            </div>
          </div>
          
          <div className="upload-area">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
              onChange={handleFileUpload}
              className="file-input"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="upload-label">
              <div className="upload-content">
                <div className="upload-icon">
                  <DocumentIcon size={48} />
                </div>
                <div className="upload-text">
                  <h3>Drop files here or click to upload</h3>
                  <p>Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX (Max 10MB)</p>
                </div>
              </div>
            </label>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              <h3>Recently Uploaded Files</h3>
              <div className="files-list">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-icon">
                      <DocumentIcon size={20} />
                    </div>
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="file-status">
                      <CheckCircleIcon size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="products-section">
        <div className="section-header">
          <h2 className="section-title">Product Requirements</h2>
          <div className="section-controls">
            <div className="search-wrapper">
              <SearchIcon className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
        
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const StatusIcon = getStatusIcon(product.status);
            return (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <div className="product-title-section">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-meta">
                      <span className="product-category">{product.category}</span>
                      <span 
                        className="risk-indicator"
                        style={{ backgroundColor: getRiskColor(product.riskLevel) }}
                      >
                        {product.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                  <div className="product-status">
                    <div className={`status-badge status-${product.status}`}>
                      <StatusIcon size={16} />
                      <span>{product.status}</span>
                    </div>
                  </div>
                </div>
                
                <p className="product-description">{product.description}</p>
                
                <div className="product-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Documents:</span>
                      <span className="detail-value">{product.documents}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Last Updated:</span>
                      <span className="detail-value">{product.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                
                <div className="compliance-requirements">
                  <h4 className="requirements-title">Compliance Standards</h4>
                  <div className="requirements-tags">
                    {product.complianceRequirements.map((req, index) => (
                      <span key={index} className="requirement-tag">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="product-actions">
                  <button className="btn btn-ghost btn-sm">
                    <DocumentIcon size={16} />
                    View Details
                  </button>
                  <button className="btn btn-primary btn-sm">
                    <ExternalLinkIcon size={16} />
                    Open
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <SearchIcon size={48} />
            </div>
            <h3>No requirements found</h3>
            <p>Try adjusting your search terms or upload new requirement documents.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRequirements; 