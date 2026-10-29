import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { schemeAPI } from '../services/api';
import AdminSchemeModal from '../components/AdminSchemeModal';
import { Plus, Edit, Trash2, Shield, Building, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalScheme, setActiveModalScheme] = useState(null); // null = closed, 'new' = new scheme, schemeObj = edit
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await schemeAPI.getAll();
      if (res.data.success) {
        setSchemes(res.data.schemes);
      }
    } catch (err) {
      console.error('Error fetching admin schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScheme = async (formData) => {
    try {
      if (activeModalScheme && activeModalScheme !== 'new') {
        const id = activeModalScheme._id || activeModalScheme.id;
        const res = await schemeAPI.update(id, formData);
        if (res.data.success) {
          setMessage('Scheme updated successfully');
        }
      } else {
        const res = await schemeAPI.create(formData);
        if (res.data.success) {
          setMessage('New scheme created successfully');
        }
      }
      setShowModal(false);
      fetchSchemes();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving scheme:', err);
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteScheme = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scheme?')) return;
    try {
      const res = await schemeAPI.delete(id);
      if (res.data.success) {
        setMessage('Scheme deleted successfully');
        fetchSchemes();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting scheme:', err);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="card text-center" style={{ padding: '4rem', maxWidth: '500px', margin: '2rem auto' }}>
        <Shield size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Admin privileges are required to access scheme management.</p>
        <Link to="/login" className="btn btn-primary">Login as Admin (admin@janseva.local)</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-eligible" style={{ marginBottom: '0.4rem' }}>
            <Shield size={14} /> System Administrator Portal
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>
            Government Scheme Management
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Add, edit, or remove criteria rules for central & state welfare schemes.</p>
        </div>

        <button
          onClick={() => { setActiveModalScheme('new'); setShowModal(true); }}
          className="btn btn-accent"
        >
          <Plus size={18} /> Add New Scheme
        </button>
      </div>

      {message && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      {loading ? (
        <div className="text-center" style={{ padding: '3rem' }}>Loading Schemes...</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--primary-light)', color: 'var(--primary)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem' }}>Scheme Title</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Ministry</th>
                  <th style={{ padding: '1rem' }}>Target Criteria</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map((s, idx) => {
                  const id = s._id || s.id;
                  const crit = s.eligibilityCriteria || {};
                  return (
                    <tr key={id} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                      <td style={{ padding: '1rem', fontWeight: 700 }}>{s.title}</td>
                      <td style={{ padding: '1rem' }}><span className="badge badge-category">{s.category}</span></td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{s.ministry}</td>
                      <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Age: {crit.minAge || 0}-{crit.maxAge || 'Any'} | Max Income: ₹{crit.maxIncome || 'None'} | Gender: {crit.gender || 'All'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => { setActiveModalScheme(s); setShowModal(true); }}
                            className="btn btn-secondary btn-sm"
                            title="Edit Scheme"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteScheme(id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--danger)' }}
                            title="Delete Scheme"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <AdminSchemeModal
          initialScheme={activeModalScheme === 'new' ? null : activeModalScheme}
          onSave={handleSaveScheme}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
