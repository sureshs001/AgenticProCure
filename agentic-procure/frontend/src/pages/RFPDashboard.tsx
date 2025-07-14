import React from 'react';
import './RFPDashboard.css';

const RFPDashboard: React.FC = () => {
  const rfpStats = {
    activeRFPs: 3,
    draftRFPs: 2,
    completedRFPs: 8,
  };

  const recentRFPs = [
    {
      id: 'rfp-001',
      title: 'Medical Device Software RFP',
      status: 'active',
      deadline: '2024-02-15',
      suppliers: 5,
      products: 2,
    },
    {
      id: 'rfp-002',
      title: 'Pharmaceutical Packaging RFP',
      status: 'draft',
      deadline: '2024-03-01',
      suppliers: 0,
      products: 1,
    },
    {
      id: 'rfp-003',
      title: 'Injectable Drug Product RFP',
      status: 'evaluating',
      deadline: '2024-01-30',
      suppliers: 8,
      products: 3,
    },
  ];

  return (
    <div className="rfp-dashboard">
      <div className="page-header">
        <h1>RFP Dashboard</h1>
        <p>Manage and track your Request for Proposals with AI-powered guidance</p>
      </div>

      <div className="rfp-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Active RFPs</h3>
            <div className="stat-value">{rfpStats.activeRFPs}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Draft RFPs</h3>
            <div className="stat-value">{rfpStats.draftRFPs}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed RFPs</h3>
            <div className="stat-value">{rfpStats.completedRFPs}</div>
          </div>
        </div>
      </div>

      <div className="rfp-content">
        <div className="card">
          <div className="card-header">
            <h2>Recent RFPs</h2>
            <button className="btn btn-primary">Create New RFP</button>
          </div>
          <div className="rfp-list">
            {recentRFPs.map((rfp) => (
              <div key={rfp.id} className="rfp-item">
                <div className="rfp-header">
                  <h3 className="rfp-title">{rfp.title}</h3>
                  <span className={`rfp-status ${rfp.status}`}>
                    {rfp.status}
                  </span>
                </div>
                <div className="rfp-details">
                  <div className="rfp-info">
                    <span><strong>Deadline:</strong> {rfp.deadline}</span>
                    <span><strong>Suppliers:</strong> {rfp.suppliers}</span>
                    <span><strong>Products:</strong> {rfp.products}</span>
                  </div>
                  <div className="rfp-actions">
                    <button className="btn btn-secondary">View Details</button>
                    <button className="btn btn-primary">Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFPDashboard; 