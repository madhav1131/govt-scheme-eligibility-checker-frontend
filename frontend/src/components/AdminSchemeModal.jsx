import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const AdminSchemeModal = ({ initialScheme, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    titleHi: '',
    category: 'Agriculture',
    ministry: '',
    description: '',
    descriptionHi: '',
    benefits: '',
    benefitAmount: '0',
    applicationUrl: 'https://gov.in',
    deadline: '',
    minAge: 18,
    maxAge: 60,
    maxIncome: 250000,
    gender: 'All',
    categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    occupations: ['All'],
    studentOnly: false,
    disabilityOnly: false,
    urbanRural: 'All',
    documentsRequired: ['Aadhaar Card', 'Income Certificate']
  });

  useEffect(() => {
    if (initialScheme) {
      const scheme = initialScheme.scheme || initialScheme;
      setFormData({
        title: scheme.title || '',
        titleHi: scheme.titleHi || '',
        category: scheme.category || 'Agriculture',
        ministry: scheme.ministry || '',
        description: scheme.description || '',
        descriptionHi: scheme.descriptionHi || '',
        benefits: scheme.benefits || '',
        benefitAmount: scheme.benefitAmount || '0',
        applicationUrl: scheme.applicationUrl || 'https://gov.in',
        deadline: scheme.deadline || '',
        minAge: scheme.eligibilityCriteria?.minAge || 0,
        maxAge: scheme.eligibilityCriteria?.maxAge || 100,
        maxIncome: scheme.eligibilityCriteria?.maxIncome || 0,
        gender: scheme.eligibilityCriteria?.gender || 'All',
        categories: scheme.eligibilityCriteria?.categories || ['All'],
        occupations: scheme.eligibilityCriteria?.occupations || ['All'],
        studentOnly: scheme.eligibilityCriteria?.studentOnly || false,
        disabilityOnly: scheme.eligibilityCriteria?.disabilityOnly || false,
        urbanRural: scheme.eligibilityCriteria?.urbanRural || 'All',
        documentsRequired: scheme.documentsRequired || ['Aadhaar Card']
      });
    }
  }, [initialScheme]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDocChange = (idx, value) => {
    const newDocs = [...formData.documentsRequired];
    newDocs[idx] = value;
    setFormData({ ...formData, documentsRequired: newDocs });
  };

  const addDocField = () => {
    setFormData({ ...formData, documentsRequired: [...formData.documentsRequired, ''] });
  };

  const removeDocField = (idx) => {
    const newDocs = formData.documentsRequired.filter((_, i) => i !== idx);
    setFormData({ ...formData, documentsRequired: newDocs });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      titleHi: formData.titleHi,
      category: formData.category,
      ministry: formData.ministry,
      description: formData.description,
      descriptionHi: formData.descriptionHi,
      benefits: formData.benefits,
      benefitAmount: formData.benefitAmount,
      applicationUrl: formData.applicationUrl,
      deadline: formData.deadline,
      eligibilityCriteria: {
        minAge: Number(formData.minAge),
        maxAge: Number(formData.maxAge),
        maxIncome: Number(formData.maxIncome),
        gender: formData.gender,
        categories: Array.isArray(formData.categories) ? formData.categories : [formData.categories],
        occupations: Array.isArray(formData.occupations) ? formData.occupations : [formData.occupations],
        studentOnly: Boolean(formData.studentOnly),
        disabilityOnly: Boolean(formData.disabilityOnly),
        urbanRural: formData.urbanRural
      },
      documentsRequired: formData.documentsRequired.filter(d => d.trim() !== '')
    };
    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
            {initialScheme ? 'Edit Government Scheme' : 'Add New Government Scheme'}
          </h2>
          <button onClick={onClose} className="btn btn-secondary btn-sm"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Scheme Title (English) *</label>
              <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Scheme Title (Hindi)</label>
              <input type="text" name="titleHi" className="form-input" value={formData.titleHi} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Sector / Category *</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option value="Agriculture">Agriculture</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Housing">Housing</option>
                <option value="Financial Inclusion">Financial Inclusion</option>
                <option value="Women Empowerment">Women Empowerment</option>
                <option value="Senior Citizens">Senior Citizens</option>
                <option value="Employment">Employment</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ministry / Department *</label>
              <input type="text" name="ministry" className="form-input" value={formData.ministry} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (English) *</label>
            <textarea name="description" rows={3} className="form-input" value={formData.description} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Benefits Summary *</label>
              <input type="text" name="benefits" className="form-input" value={formData.benefits} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Application URL</label>
              <input type="url" name="applicationUrl" className="form-input" value={formData.applicationUrl} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Application Deadline</label>
            <input type="text" name="deadline" className="form-input" placeholder="e.g. 31 March 2027" value={formData.deadline} onChange={handleChange} />
          </div>

          {/* Criteria Rules Section */}
          <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>Eligibility Engine Rules</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Min Age</label>
                <input type="number" name="minAge" className="form-input" value={formData.minAge} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Age</label>
                <input type="number" name="maxAge" className="form-input" value={formData.maxAge} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Income (0 = No Cap)</label>
                <input type="number" name="maxIncome" className="form-input" value={formData.maxIncome} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Gender</label>
                <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                  <option value="All">All</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                  <option value="Transgender">Transgender Only</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Locality</label>
                <select name="urbanRural" className="form-select" value={formData.urbanRural} onChange={handleChange}>
                  <option value="All">All Areas</option>
                  <option value="Urban">Urban Only</option>
                  <option value="Rural">Rural Only</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" name="studentOnly" checked={formData.studentOnly} onChange={handleChange} />
                Student Only Scheme
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" name="disabilityOnly" checked={formData.disabilityOnly} onChange={handleChange} />
                PwD / Disability Reserved
              </label>
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <label className="form-label">Required Documents</label>
              <button type="button" onClick={addDocField} className="btn btn-secondary btn-sm"><Plus size={14} /> Add Document</button>
            </div>
            {formData.documentsRequired.map((doc, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input type="text" className="form-input" value={doc} onChange={(e) => handleDocChange(idx, e.target.value)} required />
                {formData.documentsRequired.length > 1 && (
                  <button type="button" onClick={() => removeDocField(idx)} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Save Scheme</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSchemeModal;
