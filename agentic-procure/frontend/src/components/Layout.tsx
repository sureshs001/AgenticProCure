import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/compliance', label: 'Compliance', icon: '🛡️' },
    { path: '/product-requirements', label: 'Product Requirements', icon: '📋' },
    { path: '/rfp', label: 'RFP', icon: '📝' },
    { path: '/chat', label: 'Agent Chat', icon: '🤖' },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>Agentic ProCURE</h1>
              <span className="version">v1.0.0</span>
            </div>
            <nav className="nav">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="user-info">
              <span className="user-name">Procurement Manager</span>
              <span className="user-role">MedTech Corp</span>
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
          <p>&copy; 2024 Agentic ProCURE. AI-powered procurement solution for MedTech and Pharma industries.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 