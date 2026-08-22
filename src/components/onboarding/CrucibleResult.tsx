import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BrainCircuit, CheckCircle2, Code2, Flame, Laptop, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import '../crucible/crucible.css';

type AssessmentData = Record<string, string[]>;

const fallbackData: AssessmentData = {
  languages: ['TypeScript', 'Python'],
  dsa: ['Intermediate'],
  cs_fundamentals: ['DBMS', 'Operating Systems'],
  development: ['React', 'Node.js'],
  target_role: ['Backend Engineer'],
};

const summaryCards = [
  { id: 'languages', label: 'Primary Stack', fallback: 'TypeScript, Python', icon: Code2 },
  { id: 'dsa', label: 'Algorithm Readiness', fallback: 'Intermediate', icon: BrainCircuit },
  { id: 'development', label: 'Build Surface', fallback: 'React, Node.js', icon: Laptop },
  { id: 'target_role', label: 'Target Path', fallback: 'Backend Engineer', icon: Target },
];

export const CrucibleResult: React.FC = () => {
  const { setTrack, setHasCompletedAssessment, navigate } = useApp();
  const [data, setData] = useState<AssessmentData>(fallbackData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('crucible_assessment_data');
    if (saved) {
      try {
        setData({ ...fallbackData, ...JSON.parse(saved) });
      } catch {
        setData(fallbackData);
      }
    }

    const timer = window.setTimeout(() => setIsLoaded(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  const calibrationScore = useMemo(() => {
    const selectedCount = Object.values(data).reduce((sum: number, values: string[]) => sum + (values?.length || 0), 0);
    return Math.min(94, 68 + Number(selectedCount) * 4);
  }, [data]);

  const weakestSignal = useMemo(() => {
    const dsa = data.dsa?.join(' ').toLowerCase() || '';
    if (dsa.includes('beginner') || dsa.includes('foundation')) return 'Algorithmic depth';
    if ((data.cs_fundamentals || []).length < 2) return 'CS fundamentals';
    if ((data.development || []).length < 2) return 'Production project depth';
    return 'Spoken technical defense';
  }, [data]);

  const getLabel = (id: string, fallback: string) => {
    const values = data[id];
    return values && values.length > 0 ? values.join(', ') : fallback;
  };

  const handleEnterCrucible = () => {
    setHasCompletedAssessment(true);
    setTrack('crucible');
    navigate('/crucible/workflow');
  };

  return (
    <main className="crucible-screen crucible-result-screen">
      <section className={`crucible-result-shell ${isLoaded ? 'is-loaded' : ''}`}>
        <div className="crucible-result-hero">
          <div className="crucible-orb" aria-hidden="true" />
          <div className="crucible-kicker">
            <Flame size={16} />
            Crucible calibration complete
          </div>
          <h1>Your pressure profile is ready.</h1>
          <p>
            CareerOS has mapped your current signal into a high-intensity workflow:
            coding, architecture defense, and role-specific gap closure.
          </p>
        </div>

        <div className="crucible-result-grid">
          <article className="crucible-score-card glass-panel">
            <div className="score-ring" style={{ '--score': calibrationScore } as React.CSSProperties}>
              <span>{calibrationScore}</span>
              <small>/100</small>
            </div>
            <div>
              <span className="metric-label">Initial Crucible Fit</span>
              <h2>Conditional high-potential</h2>
              <p>
                Your foundation is strong enough for Crucible mode. The first sprint should focus on
                {` ${weakestSignal.toLowerCase()}`} before advanced role simulation.
              </p>
            </div>
          </article>

          <article className="glass-panel result-insight-card">
            <CheckCircle2 size={22} />
            <span className="metric-label">Next unlock</span>
            <h2>3-phase workflow</h2>
            <p>Logic challenge, implementation, and a short hiring-manager style defense in one continuous loop.</p>
          </article>
        </div>

        <div className="glass-panel calibration-panel">
          <div className="panel-heading">
            <span>Assessment Signals</span>
            <strong>Live calibration input</strong>
          </div>
          <div className="signal-grid">
            {summaryCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <div className="signal-card" key={item.id} style={{ '--delay': `${index * 90}ms` } as React.CSSProperties}>
                  <div className="signal-icon">
                    <Icon size={20} />
                  </div>
                  <div>
                    <span>{item.label}</span>
                    <strong>{getLabel(item.id, item.fallback)}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="crucible-primary-action" onClick={handleEnterCrucible}>
          Enter Crucible Workflow
          <ArrowRight size={20} />
        </button>
      </section>
    </main>
  );
};
