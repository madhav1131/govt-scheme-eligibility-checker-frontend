import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import EligibilityCheck from './pages/EligibilityCheck';
import SchemesCatalog from './pages/SchemesCatalog';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import LoginRegister from './pages/LoginRegister';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/check" element={<EligibilityCheck />} />
                <Route path="/catalog" element={<SchemesCatalog />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/login" element={<LoginRegister />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
