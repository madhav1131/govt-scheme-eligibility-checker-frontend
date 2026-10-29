import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ArrowLeft, CheckCircle2, User, Wallet, Briefcase, Sparkles, MapPin, Award } from 'lucide-react';

const indianStates = [
  "All India", "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const EligibilityWizard = ({ onComplete, initialValues, isSubmitting = false }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialValues || {
    age: 24,
    gender: 'Male',
    income: 180000,
    category: 'OBC',
    state: 'Uttar Pradesh',
    occupation: 'Student',
    isStudent: true,
    isDisability: false,
    urbanRural: 'Rural'
  });

  const presets = [
    { label: "College Student", age: 20, gender: "Female", income: 150000, category: "SC", state: "Bihar", occupation: "Student", isStudent: true, isDisability: false, urbanRural: "Rural" },
    { label: "Small Farmer", age: 42, gender: "Male", income: 120000, category: "OBC", state: "Uttar Pradesh", occupation: "Farmer", isStudent: false, isDisability: false, urbanRural: "Rural" },
    { label: "Senior Citizen", age: 65, gender: "Male", income: 80000, category: "General", state: "Maharashtra", occupation: "Unemployed", isStudent: false, isDisability: false, urbanRural: "Urban" },
    { label: "Woman Entrepreneur / Vendor", age: 30, gender: "Female", income: 200000, category: "EWS", state: "Delhi", occupation: "Vendor", isStudent: false, isDisability: false, urbanRural: "Urban" },
    { label: "Divyangjan (PwD)", age: 28, gender: "Male", income: 160000, category: "ST", state: "Madhya Pradesh", occupation: "Self-Employed", isStudent: false, isDisability: true, urbanRural: "Rural" }
  ];

  const applyPreset = (p) => {
    setFormData(p);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', boxShadow: 'var(--shadow-glow)' }}>
      {/* Preset Quick Fill Buttons */}
      <div style={{ marginBottom: '1.5rem', background: 'var(--primary-light)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
          <Sparkles size={16} /> Quick Profile Presets (Click to autofill):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyPreset(p)}
              className="btn btn-secondary btn-sm"
              style={{ background: 'var(--bg-card)', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stepper */}
      <div className="wizard-stepper">
        <div className={`step-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
          <div className="step-number">{step > 1 ? <CheckCircle2 size={20} /> : '1'}</div>
          <span className="step-title">{t('step1Title')}</span>
        </div>
        <div className={`step-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
          <div className="step-number">{step > 2 ? <CheckCircle2 size={20} /> : '2'}</div>
          <span className="step-title">{t('step2Title')}</span>
        </div>
        <div className={`step-item ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
          <div className="step-number">{step > 3 ? <CheckCircle2 size={20} /> : '3'}</div>
          <span className="step-title">{t('step3Title')}</span>
        </div>
        <div className={`step-item ${step === 4 ? 'active' : step > 4 ? 'completed' : ''}`}>
          <div className="step-number">4</div>
          <span className="step-title">{t('step4Title')}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Profile */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User color="var(--primary)" /> {t('step1Title')}
            </h3>

            <div className="form-group">
              <label className="form-label">{t('ageLabel')}: <strong style={{ color: 'var(--primary)' }}>{formData.age} Years</strong></label>
              <input
                type="range"
                min="1"
                max="90"
                name="age"
                value={formData.age}
                onChange={handleChange}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
              <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>1 Year</span>
                <span>90 Years</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('genderLabel')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                {['Male', 'Female', 'Transgender'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`btn ${formData.gender === g ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {t(g.toLowerCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Income & Category */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet color="var(--secondary)" /> {t('step2Title')}
            </h3>

            <div className="form-group">
              <label className="form-label">{t('incomeLabel')}: <strong style={{ color: 'var(--primary)' }}>₹{Number(formData.income).toLocaleString('en-IN')}</strong></label>
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                name="income"
                value={formData.income}
                onChange={handleChange}
                style={{ width: '100%', accentColor: 'var(--secondary)' }}
              />
              <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>₹0 (Nil)</span>
                <span>₹10,00,000+</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('categoryLabel')}</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option value="General">General</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t('areaLabel')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {['Rural', 'Urban'].map(area => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setFormData({ ...formData, urbanRural: area })}
                    className={`btn ${formData.urbanRural === area ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {t(area.toLowerCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Occupation & State */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase color="var(--accent)" /> {t('step3Title')}
            </h3>

            <div className="form-group">
              <label className="form-label">{t('occupationLabel')}</label>
              <select name="occupation" className="form-select" value={formData.occupation} onChange={handleChange}>
                <option value="Student">Student</option>
                <option value="Farmer">Farmer / Agriculture Worker</option>
                <option value="Vendor">Street Vendor / Small Trader</option>
                <option value="Unemployed">Unemployed / Job Seeker</option>
                <option value="Self-Employed">Self-Employed / Artisan</option>
                <option value="Salaried">Private / Salaried Employee</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label"><MapPin size={16} style={{ display: 'inline', marginRight: '4px' }} /> {t('stateLabel')}</label>
              <select name="state" className="form-select" value={formData.state} onChange={handleChange}>
                {indianStates.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Special Status */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award color="var(--primary)" /> {t('step4Title')}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <label className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '1rem' }}>
                <div>
                  <strong>{t('studentLabel')}</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enrolled in school, college, or vocational training institute</p>
                </div>
                <input
                  type="checkbox"
                  name="isStudent"
                  checked={formData.isStudent}
                  onChange={handleChange}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                />
              </label>

              <label className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '1rem' }}>
                <div>
                  <strong>{t('disabilityLabel')}</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Holds valid PwD benchmark disability certificate (40%+)</p>
                </div>
                <input
                  type="checkbox"
                  name="isDisability"
                  checked={formData.isDisability}
                  onChange={handleChange}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                />
              </label>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex-between" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="btn btn-secondary">
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button key="next-step" type="button" onClick={nextStep} className="btn btn-primary" disabled={isSubmitting}>
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button key="submit-eligibility" type="submit" className="btn btn-accent" style={{ padding: '0.75rem 2rem' }} disabled={isSubmitting}>
              <Sparkles size={18} /> {isSubmitting ? 'Analyzing...' : 'Analyze & Find Eligible Schemes'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EligibilityWizard;
