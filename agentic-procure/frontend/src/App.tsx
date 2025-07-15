import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ComplianceDashboard from './pages/ComplianceDashboard';
import ProductRequirements from './pages/ProductRequirements';
import RFPDashboard from './pages/RFPDashboard';
import RFPCreation from './pages/RFPCreation';
import AgentChat from './pages/AgentChat';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/compliance" element={<ComplianceDashboard />} />
            <Route path="/product-requirements" element={<ProductRequirements />} />
            <Route path="/rfp" element={<RFPDashboard />} />
            <Route path="/rfp/create" element={<RFPCreation />} />
            <Route path="/chat" element={<AgentChat />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App; 