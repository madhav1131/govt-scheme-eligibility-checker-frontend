import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SchemeCard from '../components/SchemeCard';
import SchemeDetailModal from '../components/SchemeDetailModal';
import { Bookmark, User, Shield, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, savedSchemes } = useAuth();
  const { t } = useLanguage();
  const [selectedScheme, setSelectedScheme] = useState(null);

  if (!user) {
    return (
      <div className="card text-center" style={{ padding: '4rem', maxWidth: '500px', margin: '2rem auto' }}>
        <h2>Please Login to Access Your Citizen Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Save profile details and bookmark government schemes.</p>
        <Link to="/login" className="btn btn-primary">{t('navLogin')}</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Banner */}
      <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', color: 'white' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '0.5rem' }}>
              Citizen Profile
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, {user.name}</h1>
            <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>{user.email} | Role: {user.role.toUpperCase()}</p>
          </div>

          <Link to="/check" className="btn btn-accent">
            <CheckCircle2 size={18} /> Re-run Eligibility Check
          </Link>
        </div>
      </div>

      {/* Bookmarked / Saved Schemes Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bookmark size={22} color="var(--accent)" /> Saved & Bookmarked Schemes ({savedSchemes.length})
        </h2>

        {savedSchemes.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <Bookmark size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3>No Bookmarked Schemes Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Explore government schemes and click the bookmark icon to save them here for quick access.</p>
            <Link to="/catalog" className="btn btn-primary">Browse All Schemes</Link>
          </div>
        ) : (
          <div className="grid-3">
            {savedSchemes.map(item => (
              <div key={item.schemeId} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <span className="badge badge-category" style={{ width: 'fit-content', marginBottom: '0.5rem' }}>{item.category}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{item.schemeTitle}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1 }}>{item.benefits}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Saved on: {new Date(item.savedAt).toLocaleDateString()}
                </div>
                <Link to="/catalog" className="btn btn-secondary btn-sm" style={{ marginTop: 'auto' }}>
                  View Full Details <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <SchemeDetailModal schemeData={selectedScheme} onClose={() => setSelectedScheme(null)} />
    </div>
  );
};

export default Dashboard;
