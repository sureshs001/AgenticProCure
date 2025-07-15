import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingIcon, 
  FileTextIcon, 
  ShieldIcon, 
  ClipboardListIcon,
  RobotIcon,
  UploadIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  ArrowRightIcon
} from '../components/Icons';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Suppliers',
      value: '45',
      change: '+3',
      changeType: 'positive' as const,
      icon: BuildingIcon,
      link: '/compliance',
      description: 'Active vendor relationships',
    },
    {
      title: 'Active RFPs',
      value: '3',
      change: '+1',
      changeType: 'positive' as const,
      icon: FileTextIcon,
      link: '/rfp',
      description: 'In progress procurement',
    },
    {
      title: 'Compliance Score',
      value: '92%',
      change: '+2%',
      changeType: 'positive' as const,
      icon: ShieldIcon,
      link: '/compliance',
      description: 'Overall compliance rating',
    },
    {
      title: 'Requirements',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: ClipboardListIcon,
      link: '/product-requirements',
      description: 'Product specifications',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'alert',
      icon: AlertTriangleIcon,
      title: 'High Compliance Risk Detected',
      message: 'PharmaCorp Solutions has a compliance risk score of 75% for ISO 13485',
      time: '2 hours ago',
      severity: 'high' as const,
      category: 'Compliance',
    },
    {
      id: 2,
      type: 'rfp',
      icon: FileTextIcon,
      title: 'New RFP Created',
      message: 'Medical Device Software RFP has been initiated with 5 suppliers',
      time: '4 hours ago',
      severity: 'medium' as const,
      category: 'RFP',
    },
    {
      id: 3,
      type: 'supplier',
      icon: CheckCircleIcon,
      title: 'Compliance Documentation Updated',
      message: 'PackagingPro Ltd successfully updated their ISO 13485 certification',
      time: '1 day ago',
      severity: 'low' as const,
      category: 'Supplier',
    },
  ];

  const quickActions = [
    {
      title: 'Chat with AI Assistant',
      description: 'Get instant help with procurement queries',
      icon: RobotIcon,
      link: '/chat',
      variant: 'primary' as const,
    },
    {
      title: 'Upload Requirements',
      description: 'Add new product specifications',
      icon: UploadIcon,
      link: '/product-requirements',
      variant: 'secondary' as const,
    },
    {
      title: 'Create New RFP',
      description: 'Start a new procurement process',
      icon: FileTextIcon,
      link: '/rfp/create',
      variant: 'secondary' as const,
    },
    {
      title: 'Review Compliance',
      description: 'Check supplier compliance status',
      icon: ShieldIcon,
      link: '/compliance',
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back, Sarah</h1>
          <p className="welcome-subtitle">
            Here's what's happening with your procurement activities today.
          </p>
        </div>
        <div className="header-actions">
          <Link to="/chat" className="btn btn-primary">
            <RobotIcon size={18} />
            Ask AI Assistant
          </Link>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Link key={index} to={stat.link} className="stat-card">
                <div className="stat-card-content">
                  <div className="stat-header">
                    <div className="stat-icon-wrapper">
                      <IconComponent className="stat-icon" size={24} />
                    </div>
                    <div className="stat-trend">
                      <TrendingUpIcon size={16} />
                    </div>
                  </div>
                  <div className="stat-body">
                    <div className="stat-value">{stat.value}</div>
                    <h3 className="stat-title">{stat.title}</h3>
                    <p className="stat-description">{stat.description}</p>
                  </div>
                  <div className="stat-footer">
                    <div className={`stat-change ${stat.changeType}`}>
                      {stat.change} from last month
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-grid">
          <div className="activities-section">
            <div className="section-header">
              <h2 className="section-title">Recent Activities</h2>
              <Link to="/compliance" className="section-action">
                View All
                <ArrowRightIcon size={16} />
              </Link>
            </div>
            <div className="card">
              <div className="activity-list">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className={`activity-item severity-${activity.severity}`}>
                      <div className="activity-icon">
                        <IconComponent size={20} />
                      </div>
                      <div className="activity-content">
                        <div className="activity-header">
                          <h4 className="activity-title">{activity.title}</h4>
                          <span className={`activity-category category-${activity.severity}`}>
                            {activity.category}
                          </span>
                        </div>
                        <p className="activity-message">{activity.message}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="actions-section">
            <div className="section-header">
              <h2 className="section-title">Quick Actions</h2>
            </div>
            <div className="quick-actions">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className={`action-card btn-${action.variant}`}
                  >
                    <div className="action-icon">
                      <IconComponent size={20} />
                    </div>
                    <div className="action-content">
                      <h3 className="action-title">{action.title}</h3>
                      <p className="action-description">{action.description}</p>
                    </div>
                    <ArrowRightIcon className="action-arrow" size={16} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 