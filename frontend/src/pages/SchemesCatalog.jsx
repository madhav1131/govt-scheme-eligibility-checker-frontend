import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { schemeAPI } from '../services/api';
import SchemeCard from '../components/SchemeCard';
import SchemeDetailModal from '../components/SchemeDetailModal';
import { Search, Filter, Layers } from 'lucide-react';

const categories = [
  "All", "Agriculture", "Healthcare", "Education", "Housing", 
  "Financial Inclusion", "Women Empowerment", "Senior Citizens", "Employment"
];

const targetGroups = [
  "All", "Farmer", "Student", "Vendor", "Unemployed", "Self-Employed"
];

const SchemesCatalog = () => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTargetGroup, setSelectedTargetGroup] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory, selectedTargetGroup, search]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await schemeAPI.getAll({
        category: selectedCategory,
        targetGroup: selectedTargetGroup,
        search
      });
      if (res.data.success) {
        setSchemes(res.data.schemes);
      }
    } catch (err) {
      console.error('Error loading schemes catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Government Schemes Directory
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse all central and state government benefits, eligibility criteria, and application links.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.75rem' }}
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <Filter size={16} color="var(--primary)" /> Sectors:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <Layers size={16} color="var(--secondary)" /> Target Group:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {targetGroups.map(tg => (
              <button
                key={tg}
                onClick={() => setSelectedTargetGroup(tg)}
                className={`btn ${selectedTargetGroup === tg ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                {tg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes List */}
      {loading ? (
        <div className="text-center" style={{ padding: '3rem' }}>Loading Schemes Catalog...</div>
      ) : schemes.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <h3>No schemes found matching your search filters</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try resetting category or search query.</p>
        </div>
      ) : (
        <div className="grid-3">
          {schemes.map(s => (
            <SchemeCard key={s._id || s.id} schemeData={s} onOpenDetail={setSelectedScheme} />
          ))}
        </div>
      )}

      <SchemeDetailModal schemeData={selectedScheme} onClose={() => setSelectedScheme(null)} />
    </div>
  );
};

export default SchemesCatalog;
