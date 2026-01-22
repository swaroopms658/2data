import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LicenseInventory from './components/LicenseInventory';
import VendorOptimization from './components/VendorOptimization';
import Analytics from './components/Analytics';
import AuditRisk from './components/AuditRisk';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="app-container" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Header theme={theme} toggleTheme={toggleTheme} />

        <main style={{ paddingTop: 'var(--header-height)' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/licenses" element={<LicenseInventory />} />
            <Route path="/optimization" element={<VendorOptimization />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/audit" element={<AuditRisk />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
