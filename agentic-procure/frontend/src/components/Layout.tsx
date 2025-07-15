import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DashboardIcon, 
  ShieldIcon, 
  ClipboardListIcon, 
  FileTextIcon, 
  RobotIcon,
  UserIcon,
  SettingsIcon 
} from './Icons';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: DashboardIcon },
    { path: '/compliance', label: 'Compliance', icon: ShieldIcon },
    { path: '/product-requirements', label: 'Requirements', icon: ClipboardListIcon },
    { path: '/rfp', label: 'RFP Management', icon: FileTextIcon },
    { path: '/chat', label: 'AI Assistant', icon: RobotIcon },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">
                <div className="logo-icon">
                  <ShieldIcon size={28} />
                </div>
                <div className="logo-text">
                  <h1>Agentic ProCURE</h1>
                  <span className="version">Enterprise Edition</span>
                </div>
              </div>
            </div>
            
            <nav className="nav">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <IconComponent className="nav-icon" size={18} />
                    <span className="nav-label">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="header-actions">
              <div className="user-info">
                <div className="user-avatar">
                  <UserIcon size={20} />
                </div>
                <div className="user-details">
                  <span className="user-name">Sarah Mitchell</span>
                  <span className="user-role">Procurement Manager</span>
                  <span className="user-org">MedTech Corp</span>
                </div>
              </div>
              <button className="settings-btn">
                <SettingsIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <p>&copy; 2024 Agentic ProCURE. Enterprise AI-powered procurement platform.</p>
            </div>
            <div className="footer-right">
              <span className="footer-badge">SOC 2 Type II Certified</span>
              <span className="footer-badge">HIPAA Compliant</span>
              <span className="footer-badge">ISO 27001</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 