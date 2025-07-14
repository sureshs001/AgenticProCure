import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Suppliers',
      value: '45',
      change: '+3',
      changeType: 'positive',
      icon: '🏢',
      link: '/compliance',
    },
    {
      title: 'Active RFPs',
      value: '3',
      change: '+1',
      changeType: 'positive',
      icon: '📝',
      link: '/rfp',
    },
    {
      title: 'Compliance Score',
      value: '92%',
      change: '+2%',
      changeType: 'positive',
      icon: '🛡️',
      link: '/compliance',
    },
    {
      title: 'Product Requirements',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: '📋',
      link: '/product-requirements',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'alert',
      message: 'High compliance risk detected for PharmaCorp Solutions',
      time: '2 hours ago',
      severity: 'high',
    },
    {
      id: 2,
      type: 'rfp',
      message: 'New RFP created for Medical Device Software',
      time: '4 hours ago',
      severity: 'medium',
    },
    {
      id: 3,
      type: 'supplier',
      message: 'PackagingPro Ltd updated compliance documentation',
      time: '1 day ago',
      severity: 'low',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, Procurement Manager</h1>
        <p>Here's what's happening with your procurement activities today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.changeType}`}>
                {stat.change}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="content-grid">
          <div className="card">
            <h2>Recent Activities</h2>
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.severity}`}>
                  <div className="activity-icon">
                    {activity.type === 'alert' && '⚠️'}
                    {activity.type === 'rfp' && '📝'}
                    {activity.type === 'supplier' && '🏢'}
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/chat" className="btn btn-primary">
                🤖 Chat with AI Agent
              </Link>
              <Link to="/product-requirements" className="btn btn-secondary">
                📋 Upload Requirements
              </Link>
              <Link to="/rfp" className="btn btn-secondary">
                📝 Create New RFP
              </Link>
              <Link to="/compliance" className="btn btn-secondary">
                🛡️ Check Compliance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 