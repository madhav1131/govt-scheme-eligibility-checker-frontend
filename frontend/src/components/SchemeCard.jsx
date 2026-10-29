import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Bookmark, CheckCircle2, AlertTriangle, XCircle, ExternalLink, ArrowRight, Building, Award, CalendarClock } from 'lucide-react';

const SchemeCard = ({ schemeData, onOpenDetail }) => {
  const { lang, t } = useLanguage();
  const { isBookmarked, toggleBookmark, user } = useAuth();

  // schemeData can be { scheme, matchPercentage, status, passedCriteria, failedCriteria } or just a scheme object
  const scheme = schemeData.scheme || schemeData;
  const matchPercentage = schemeData.matchPercentage;
  const status = schemeData.status;

  const title = lang === 'hi' && scheme.titleHi ? scheme.titleHi : scheme.title;
  const description = lang === 'hi' && scheme.descriptionHi ? scheme.descriptionHi : scheme.description;
  const bookmarked = isBookmarked(scheme._id || scheme.id);

  const getStatusBadge = () => {
    if (!status) return null;
    if (status === 'Eligible') {
      return (
        <span className="badge badge-eligible">
          <CheckCircle2 size={14} /> {t('eligible')} ({matchPercentage}%)
        </span>
      );
    }
    if (status === 'Partially Eligible') {
      return (
        <span className="badge badge-partial">
          <AlertTriangle size={14} /> {t('partiallyEligible')} ({matchPercentage}%)
        </span>
      );
    }
    return (
      <span className="badge badge-ineligible">
        <XCircle size={14} /> {t('ineligible')} ({matchPercentage}%)
      </span>
    );
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
        <span className="badge badge-category">{scheme.category}</span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {getStatusBadge()}
          {user && (
            <button
              onClick={() => toggleBookmark(scheme)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: bookmarked ? '#f97316' : 'var(--text-muted)',
                padding: '0.2rem'
              }}
              title={bookmarked ? t('saved') : t('saveScheme')}
            >
              <Bookmark size={18} fill={bookmarked ? '#f97316' : 'none'} />
            </button>
          )}
        </div>
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
        {title}
      </h3>

      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
        <Building size={14} />
        <span>{scheme.ministry}</span>
      </div>

      <p style={{
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        marginBottom: '1.25rem',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        flex: 1
      }}>
        {description}
      </p>

      {scheme.benefits && (
        <div style={{
          background: 'var(--primary-light)',
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          color: 'var(--primary)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Award size={16} />
          <span>{scheme.benefits}</span>
        </div>
      )}

      {scheme.deadline && (
        <div className="scheme-deadline">
          <CalendarClock size={16} />
          <span>Deadline: {scheme.deadline}</span>
        </div>
      )}

      <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
        <button onClick={() => onOpenDetail(schemeData)} className="btn btn-secondary btn-sm">
          {t('viewDetails')}
          <ArrowRight size={14} />
        </button>

        {scheme.applicationUrl && (
          <a
            href={scheme.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            {t('applyNow')}
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

export default SchemeCard;
