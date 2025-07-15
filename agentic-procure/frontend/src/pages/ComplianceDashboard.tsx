import React from 'react';
import { 
  BuildingIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  ChartBarIcon,
  ShieldIcon,
  ExternalLinkIcon,
  TrendingUpIcon
} from '../components/Icons';
import './ComplianceDashboard.css';

const ComplianceDashboard: React.FC = () => {
  const complianceData = [
    {
      title: 'Total Suppliers',
      value: '45',
      description: 'Active vendor relationships',
      icon: BuildingIcon,
      trend: '+2 this month',
      trendType: 'positive' as const,
    },
    {
      title: 'Compliant Suppliers',
      value: '38',
      description: 'Meeting all requirements',
      icon: CheckCircleIcon,
      trend: '+1 this month',
      trendType: 'positive' as const,
    },
    {
      title: 'At Risk Suppliers',
      value: '7',
      description: 'Requiring attention',
      icon: AlertTriangleIcon,
      trend: '+1 this month',
      trendType: 'negative' as const,
    },
    {
      title: 'Compliance Score',
      value: '92%',
      description: 'Overall rating',
      icon: ShieldIcon,
      trend: '+2% this month',
      trendType: 'positive' as const,
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'compliance_risk',
      severity: 'high' as const,
      icon: AlertTriangleIcon,
      title: 'Supplier Compliance Risk Detected',
      message: 'PharmaCorp Solutions has a compliance risk score of 75% for ISO 13485',
      time: '2 hours ago',
      category: 'ISO 13485',
      supplier: 'PharmaCorp Solutions',
    },
    {
      id: 2,
      type: 'deadline_approaching',
      severity: 'medium' as const,
      icon: ShieldIcon,
      title: 'Compliance Deadline Approaching',
      message: 'FDA 21 CFR 820 compliance assessment due in 30 days',
      time: '1 day ago',
      category: 'FDA 21 CFR 820',
      supplier: 'Multiple Suppliers',
    },
    {
      id: 3,
      type: 'document_updated',
      severity: 'low' as const,
      icon: CheckCircleIcon,
      title: 'Compliance Documentation Updated',
      message: 'MedDevice Inc. successfully renewed their ISO 13485 certification',
      time: '3 days ago',
      category: 'ISO 13485',
      supplier: 'MedDevice Inc.',
    },
  ];

  const riskTrends = [
    { date: 'Jan 1', score: 25, color: 'var(--success-500)' },
    { date: 'Jan 2', score: 28, color: 'var(--success-500)' },
    { date: 'Jan 3', score: 32, color: 'var(--warning-500)' },
    { date: 'Jan 4', score: 30, color: 'var(--warning-500)' },
    { date: 'Jan 5', score: 35, color: 'var(--error-500)' },
  ];

  const complianceCategories = [
    { name: 'ISO 13485', compliant: 38, total: 45, percentage: 84 },
    { name: 'FDA 21 CFR 820', compliant: 35, total: 45, percentage: 78 },
    { name: 'EU MDR', compliant: 42, total: 45, percentage: 93 },
    { name: 'ISO 14971', compliant: 40, total: 45, percentage: 89 },
  ];

  return (
    <div className="compliance-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Compliance & Risk Dashboard</h1>
            <p className="page-subtitle">
              Monitor supplier compliance and risk levels in real-time with comprehensive tracking
            </p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <ExternalLinkIcon size={18} />
              Export Report
            </button>
            <button className="btn btn-primary">
              <ShieldIcon size={18} />
              Run Compliance Check
            </button>
          </div>
        </div>
      </div>

      <div className="compliance-stats">
        <div className="stats-grid">
          {complianceData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="compliance-stat-card">
                <div className="stat-card-content">
                  <div className="stat-header">
                    <div className="stat-icon-wrapper">
                      <IconComponent className="stat-icon" size={24} />
                    </div>
                    <div className="stat-trend-icon">
                      <TrendingUpIcon size={16} />
                    </div>
                  </div>
                  <div className="stat-body">
                    <div className="stat-value">{stat.value}</div>
                    <h3 className="stat-title">{stat.title}</h3>
                    <p className="stat-description">{stat.description}</p>
                  </div>
                  <div className="stat-footer">
                    <div className={`stat-change ${stat.trendType}`}>
                      {stat.trend}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-grid">
          <div className="alerts-section">
            <div className="section-header">
              <h2 className="section-title">Recent Alerts</h2>
              <button className="section-action">
                View All Alerts
                <ExternalLinkIcon size={16} />
              </button>
            </div>
            <div className="card">
              <div className="alerts-list">
                {recentAlerts.map((alert) => {
                  const IconComponent = alert.icon;
                  return (
                    <div key={alert.id} className={`alert-item severity-${alert.severity}`}>
                      <div className="alert-icon">
                        <IconComponent size={20} />
                      </div>
                      <div className="alert-content">
                        <div className="alert-header">
                          <h4 className="alert-title">{alert.title}</h4>
                          <div className="alert-meta">
                            <span className={`alert-category category-${alert.severity}`}>
                              {alert.category}
                            </span>
                            <span className="alert-supplier">{alert.supplier}</span>
                          </div>
                        </div>
                        <p className="alert-message">{alert.message}</p>
                        <span className="alert-time">{alert.time}</span>
                      </div>
                      <button className="alert-action">
                        <ExternalLinkIcon size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="trends-section">
            <div className="section-header">
              <h2 className="section-title">Risk Trends</h2>
            </div>
            <div className="card">
              <div className="risk-chart">
                <div className="chart-header">
                  <p className="chart-description">Risk incidents over the last 5 days</p>
                </div>
                <div className="chart-container">
                  {riskTrends.map((trend, index) => (
                    <div key={index} className="chart-bar">
                      <div 
                        className="bar" 
                        style={{ 
                          height: `${trend.score}%`,
                          backgroundColor: trend.color 
                        }}
                      ></div>
                      <span className="bar-label">{trend.date}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="compliance-breakdown">
                <h3 className="breakdown-title">Compliance by Standard</h3>
                <div className="breakdown-list">
                  {complianceCategories.map((category, index) => (
                    <div key={index} className="breakdown-item">
                      <div className="breakdown-header">
                        <span className="breakdown-name">{category.name}</span>
                        <span className="breakdown-percentage">{category.percentage}%</span>
                      </div>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <div className="breakdown-stats">
                        <span className="breakdown-text">
                          {category.compliant} of {category.total} suppliers
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard; 