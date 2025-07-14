import React from 'react';
import './ComplianceDashboard.css';

const ComplianceDashboard: React.FC = () => {
  const complianceData = {
    totalSuppliers: 45,
    compliantSuppliers: 38,
    atRiskSuppliers: 7,
    complianceScore: 92,
  };

  const recentAlerts = [
    {
      id: 1,
      type: 'compliance_risk',
      severity: 'high',
      title: 'Supplier Compliance Risk Detected',
      message: 'PharmaCorp Solutions has a compliance risk score of 75% for ISO 13485',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'deadline_approaching',
      severity: 'medium',
      title: 'Compliance Deadline Approaching',
      message: 'FDA 21 CFR 820 compliance assessment due in 30 days',
      time: '1 day ago',
    },
  ];

  const riskTrends = [
    { date: 'Jan 1', score: 25 },
    { date: 'Jan 2', score: 28 },
    { date: 'Jan 3', score: 32 },
    { date: 'Jan 4', score: 30 },
    { date: 'Jan 5', score: 35 },
  ];

  return (
    <div className="compliance-dashboard">
      <div className="dashboard-header">
        <h1>Compliance & Risk Dashboard</h1>
        <p>Monitor supplier compliance and risk levels in real-time</p>
      </div>

      <div className="compliance-stats">
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>Total Suppliers</h3>
            <div className="stat-value">{complianceData.totalSuppliers}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Compliant Suppliers</h3>
            <div className="stat-value">{complianceData.compliantSuppliers}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>At Risk Suppliers</h3>
            <div className="stat-value">{complianceData.atRiskSuppliers}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Compliance Score</h3>
            <div className="stat-value">{complianceData.complianceScore}%</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-grid">
          <div className="card">
            <h2>Recent Alerts</h2>
            <div className="alerts-list">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.severity}`}>
                  <div className="alert-icon">
                    {alert.severity === 'high' && '🔴'}
                    {alert.severity === 'medium' && '🟡'}
                    {alert.severity === 'low' && '🟢'}
                  </div>
                  <div className="alert-content">
                    <h4 className="alert-title">{alert.title}</h4>
                    <p className="alert-message">{alert.message}</p>
                    <span className="alert-time">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>Risk Trends</h2>
            <div className="risk-chart">
              <div className="chart-container">
                {riskTrends.map((trend, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar" 
                      style={{ height: `${trend.score}%` }}
                    ></div>
                    <span className="bar-label">{trend.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard; 