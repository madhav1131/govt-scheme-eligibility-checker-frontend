import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { schemeAPI } from '../services/api';
import SchemeCard from '../components/SchemeCard';
import SchemeDetailModal from '../components/SchemeDetailModal';
import { CheckCircle2, Search, ArrowRight, Shield, Zap, Sparkles, Building2, Users, Layers } from 'lucide-react';

const Home = () => {
  const { t } = useLanguage();
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await schemeAPI.getAll();
      if (res.data.success) {
        setFeaturedSchemes(res.data.schemes.slice(0, 6));
      }
    } catch (err) {
      console.log('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <span className="badge badge-eligible" style={{ marginBottom: '1rem' }}>
          <Sparkles size={14} /> Independent Scheme Guide
        </span>
        <h1 className="hero-title">
          {t('heroTitle')}
        </h1>
        <p className="hero-subtitle">
          {t('heroDesc')}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/check" className="btn btn-accent" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            <CheckCircle2 size={20} />
            {t('checkNowBtn')}
          </Link>
          <Link to="/catalog" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            <Search size={20} />
            {t('exploreBtn')}
          </Link>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card text-center" style={{ borderLeft: '4px solid var(--primary)' }}>
          <Building2 size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>50+</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('statSchemes')}</p>
        </div>
        <div className="card text-center" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <Layers size={32} color="var(--secondary)" style={{ margin: '0 auto 0.5rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>8</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('statCategories')}</p>
        </div>
        <div className="card text-center" style={{ borderLeft: '4px solid var(--accent)' }}>
          <Zap size={32} color="var(--accent)" style={{ margin: '0 auto 0.5rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>100%</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('statAccuracy')}</p>
        </div>
      </section>

      {/* Featured Schemes Section */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Popular Government Schemes
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Key central & state welfare programs active across India
            </p>
          </div>
          <Link to="/catalog" className="btn btn-secondary btn-sm">
            View All Schemes <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center" style={{ padding: '3rem' }}>Loading Government Schemes...</div>
        ) : (
          <div className="grid-3">
            {featuredSchemes.map(s => (
              <SchemeCard key={s._id || s.id} schemeData={s} onOpenDetail={setSelectedScheme} />
            ))}
          </div>
        )}
      </section>

      {/* How it Works Section */}
      <section style={{ background: 'var(--bg-card)', padding: '2.5rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '3rem' }}>
        <h2 className="text-center" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>
          How Eligibility Checking Works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          <div className="text-center">
            <div style={{ width: '50px', height: '50px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 800, fontSize: '1.2rem' }}>1</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Enter Your Details</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Fill in simple demographics like age, family income, caste, state, and occupation.</p>
          </div>
          <div className="text-center">
            <div style={{ width: '50px', height: '50px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 800, fontSize: '1.2rem' }}>2</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Smart Match Analysis</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Our rule engine checks criteria thresholds against database guidelines.</p>
          </div>
          <div className="text-center">
            <div style={{ width: '50px', height: '50px', background: 'var(--warning-bg)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 800, fontSize: '1.2rem' }}>3</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Get Results & Apply</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Review matched schemes, document checklists, and jump to direct application URLs.</p>
          </div>
        </div>
      </section>

      <SchemeDetailModal schemeData={selectedScheme} onClose={() => setSelectedScheme(null)} />
    </div>
  );
};

export default Home;
