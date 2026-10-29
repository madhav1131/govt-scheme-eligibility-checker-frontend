import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Landmark, Languages, User, LogOut, CheckCircle, Search, Shield, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Landmark size={28} color="#f97316" />
        <span>{t('brand')}</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          {t('navHome')}
        </Link>
        <Link to="/check" className={`nav-link ${isActive('/check') ? 'active' : ''}`}>
          <CheckCircle size={16} />
          {t('navCheck')}
        </Link>
        <Link to="/catalog" className={`nav-link ${isActive('/catalog') ? 'active' : ''}`}>
          <Search size={16} />
          {t('navCatalog')}
        </Link>
        {user && (
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
            {t('navDashboard')}
          </Link>
        )}
        {user && user.role === 'admin' && (
          <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
            <Shield size={16} />
            {t('navAdmin')}
          </Link>
        )}
      </div>

      <div className="nav-actions">
        <button 
          onClick={toggleLanguage} 
          className="btn btn-secondary btn-sm"
          title="Switch Language / भाषा बदलें"
        >
          <Languages size={16} />
          <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary btn-sm"
          title="Toggle Dark/Light Mode"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {user ? (
          <div className="flex-gap-2">
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>
              <User size={16} style={{ display: 'inline', marginRight: '4px' }} />
              {user.name}
            </span>
            <button onClick={logout} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}>
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            {t('navLogin')}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
