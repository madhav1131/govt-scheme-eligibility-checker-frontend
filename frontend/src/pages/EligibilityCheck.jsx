import React, { useState } from 'react';
import { eligibilityAPI } from '../services/api';
import EligibilityWizard from '../components/EligibilityWizard';
import SchemeCard from '../components/SchemeCard';
import SchemeDetailModal from '../components/SchemeDetailModal';
import { CheckCircle2, AlertTriangle, Sparkles, Printer, Filter, RefreshCw } from 'lucide-react';

const EligibilityCheck = () => {
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [filterTab, setFilterTab] = useState('All'); // 'All', 'Eligible', 'Partially Eligible'

  const handleRunCheck = async (formData) => {
    if (loading) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await eligibilityAPI.check(formData);
      if (res.data.success) {
        setResultsData(res.data);
      } else {
        setErrorMessage(res.data.message || 'Unable to analyze eligibility. Please try again.');
      }
    } catch (err) {
      console.error('Eligibility check error:', err);
      setErrorMessage(
        err.response?.data?.message
          || 'Could not analyze eligibility. Check that the backend API and MySQL database are running, then try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    setResultsData(null);
  };

  const getFilteredResults = () => {
    if (!resultsData || !resultsData.results) return [];
    if (filterTab === 'Eligible') return resultsData.results.filter(r => r.status === 'Eligible');
    if (filterTab === 'Partially Eligible') return resultsData.results.filter(r => r.status === 'Partially Eligible');
    return resultsData.results;
  };

  return (
    <div>
      {!resultsData ? (
        <div>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Government Scheme Eligibility Assessment
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Fill in your demographic details below to let our rules engine match you with active government welfare schemes.
            </p>
          </div>

          {errorMessage && (
            <div role="alert" className="card" style={{ margin: '0 auto 1rem', maxWidth: '800px', color: 'var(--danger)', background: 'var(--danger-bg)' }}>
              {errorMessage}
            </div>
          )}
          {loading && (
            <div className="card text-center" role="status" style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto 1rem' }}>
              <Sparkles size={20} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Analyzing your profile against available schemes...
            </div>
          )}
          <EligibilityWizard onComplete={handleRunCheck} isSubmitting={loading} />
        </div>
      ) : (
        <div>
          {/* Results Summary Dashboard */}
          <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-card) 100%)', borderLeft: '6px solid var(--primary)' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-category" style={{ marginBottom: '0.4rem' }}>Evaluation Complete</span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Your Custom Eligibility Report</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Based on: Age {resultsData.summary.userProvidedDetails.age} yrs | Income ₹{Number(resultsData.summary.userProvidedDetails.income).toLocaleString('en-IN')} | Category: {resultsData.summary.userProvidedDetails.category} | State: {resultsData.summary.userProvidedDetails.state}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={resetForm} className="btn btn-secondary btn-sm">
                  <RefreshCw size={16} /> Edit Profile
                </button>
                <button onClick={handlePrint} className="btn btn-primary btn-sm">
                  <Printer size={16} /> Print Report
                </button>
              </div>
            </div>

            {/* Score Counters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 700 }}>FULLY ELIGIBLE</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>{resultsData.summary.fullyEligibleCount} Schemes</div>
              </div>
              <div style={{ background: 'var(--warning-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 700 }}>PARTIALLY ELIGIBLE</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--warning)' }}>{resultsData.summary.partiallyEligibleCount} Schemes</div>
              </div>
              <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>TOTAL EVALUATED</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{resultsData.summary.totalEvaluated} Schemes</div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['All', 'Eligible', 'Partially Eligible'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`btn ${filterTab === tab ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                >
                  {tab} Schemes
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing {getFilteredResults().length} matches
            </span>
          </div>

          {/* Results Grid */}
          <div className="grid-3">
            {getFilteredResults().map(item => (
              <SchemeCard
                key={item.scheme._id || item.scheme.id}
                schemeData={item}
                onOpenDetail={setSelectedScheme}
              />
            ))}
          </div>
        </div>
      )}

      <SchemeDetailModal schemeData={selectedScheme} onClose={() => setSelectedScheme(null)} />
    </div>
  );
};

export default EligibilityCheck;
