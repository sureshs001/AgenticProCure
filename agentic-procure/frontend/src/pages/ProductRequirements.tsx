import React, { useState } from 'react';
import './ProductRequirements.css';

const ProductRequirements: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const sampleProducts = [
    {
      id: 'prod-001',
      name: 'Injectable Drug Product',
      category: 'Drug',
      description: 'Sterile injectable drug product for cardiovascular treatment',
      complianceRequirements: ['FDA 21 CFR 211', 'USP'],
      status: 'active',
    },
    {
      id: 'prod-002',
      name: 'Medical Device Software',
      category: 'Software',
      description: 'Software as Medical Device (SaMD) for diagnostic imaging',
      complianceRequirements: ['FDA 21 CFR 820', 'ISO 13485'],
      status: 'active',
    },
    {
      id: 'prod-003',
      name: 'Pharmaceutical Packaging Material',
      category: 'Packaging',
      description: 'Child-resistant packaging material for oral solid dosage forms',
      complianceRequirements: ['ISO 13485', 'FDA 21 CFR 211'],
      status: 'pending',
    },
  ];

  return (
    <div className="product-requirements">
      <div className="page-header">
        <h1>Product Requirements Repository</h1>
        <p>Upload and manage product requirement documents with AI-powered analysis</p>
      </div>

      <div className="upload-section">
        <div className="card">
          <h2>Upload Requirements Document</h2>
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
              <div className="upload-icon">📄</div>
              <div className="upload-text">
                <h3>Drop files here or click to upload</h3>
                <p>Supported formats: PDF, DOC, DOCX, TXT, XLS, XLSX</p>
              </div>
            </label>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              <h3>Uploaded Files:</h3>
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="file-item">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="products-section">
        <div className="card">
          <h2>Product Requirements</h2>
          <div className="products-grid">
            {sampleProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <h3 className="product-name">{product.name}</h3>
                  <span className={`product-status ${product.status}`}>
                    {product.status}
                  </span>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-category">
                  <strong>Category:</strong> {product.category}
                </div>
                <div className="compliance-requirements">
                  <strong>Compliance Requirements:</strong>
                  <ul>
                    {product.complianceRequirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRequirements; 