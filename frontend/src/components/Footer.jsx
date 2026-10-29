import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Heart, ExternalLink, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer style={{
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border)',
      padding: '3rem 1.5rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Top Multi-Column Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem'
        }}>
          {/* Col 1: Portal Brand & Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Landmark size={26} color="#f97316" />
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                {t('brand')}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
              {t('subtitle')} — Explore government schemes and find links to their application websites.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Quick Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>{t('navHome')}</Link>
              <Link to="/check" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>{t('navCheck')}</Link>
              <Link to="/catalog" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>{t('navCatalog')}</Link>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>{t('navDashboard')}</Link>
              <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>{t('navAdmin')}</Link>
            </div>
          </div>

          {/* Col 3: Government Scheme Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Government Scheme Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                National Portal of India <ExternalLink size={12} />
              </a>
              <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                PM-KISAN Portal <ExternalLink size={12} />
              </a>
              <a href="https://pmjay.gov.in" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Ayushman Bharat PM-JAY <ExternalLink size={12} />
              </a>
              <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                National Scholarship Portal <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Col 4: Independence disclaimer */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Important Note
            </h4>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <Info size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
              <span>This is an independent information guide, not an official government website. Please verify scheme details on the linked government websites.</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Credits Bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <p>© 2026 JanSeva Guide. Independent information service.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Made with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Public Welfare
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
