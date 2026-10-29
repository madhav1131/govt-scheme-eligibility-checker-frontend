import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, CheckCircle2, AlertCircle, FileText, ExternalLink, Building, Award, UserCheck, CalendarClock } from 'lucide-react';

const SchemeDetailModal = ({ schemeData, onClose }) => {
  const { lang, t } = useLanguage();
  if (!schemeData) return null;

  const scheme = schemeData.scheme || schemeData;
  const passedCriteria = schemeData.passedCriteria || [];
  const failedCriteria = schemeData.failedCriteria || [];

  const title = lang === 'hi' && scheme.titleHi ? scheme.titleHi : scheme.title;
  const description = lang === 'hi' && scheme.descriptionHi ? scheme.descriptionHi : scheme.description;
  const criteria = scheme.eligibilityCriteria || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div>
            <span className="badge badge-category" style={{ marginBottom: '0.4rem' }}>{scheme.category}</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{title}</h2>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ borderRadius: '50%', padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={16} color="var(--primary)" />
            <strong>Ministry/Department:</strong> {scheme.ministry}
          </div>

          {scheme.deadline && (
            <div className="scheme-deadline scheme-deadline-detail">
              <CalendarClock size={18} />
              <span>Application Deadline: {scheme.deadline}</span>
            </div>
          )}

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{description}</p>

          <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(30, 58, 138, 0.15)' }}>
            <h4 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Award size={18} /> Scheme Benefits
            </h4>
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{scheme.benefits}</p>
          </div>

          {/* Eligibility Criteria Breakdown */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={18} color="var(--secondary)" /> Eligibility Overview & Rules
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Age Limit</span>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{criteria.minAge || 0} to {criteria.maxAge || 'Any'} years</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Max Income</span>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {criteria.maxIncome > 0 ? `₹${Number(criteria.maxIncome).toLocaleString('en-IN')}` : 'No Income Cap'}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gender</span>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{criteria.gender || 'All'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Categories</span>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{Array.isArray(criteria.categories) ? criteria.categories.join(', ') : 'All'}</p>
              </div>
            </div>
          </div>

          {/* Evaluation Details if checked */}
          {(passedCriteria.length > 0 || failedCriteria.length > 0) && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Your Eligibility Evaluation</h4>
              {passedCriteria.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <CheckCircle2 size={16} /> {c}
                </div>
              ))}
              {failedCriteria.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <AlertCircle size={16} /> {c}
                </div>
              ))}
            </div>
          )}

          {/* Documents Required */}
          {scheme.documentsRequired && scheme.documentsRequired.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="var(--accent)" /> Required Documents for Application
              </h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {scheme.documentsRequired.map((doc, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={onClose} className="btn btn-secondary">Close</button>
            {scheme.applicationUrl && (
              <a href={scheme.applicationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {t('applyNow')} <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetailModal;
