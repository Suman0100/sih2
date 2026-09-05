import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Check, Building2, Star, ArrowRight, ChevronDown, AlertCircle, ShieldCheck } from 'lucide-react';
import { PageTransition } from '../../components/ui/PageTransition';
import { Card, SectionHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar, AnimatedCounter } from '../../components/ui/Progress';
import { universityService } from '../../services/universityService';
import { problemService } from '../../services/problemService';
import { useApp } from '../../context/AppContext';
import { DEMO_UNIVERSITY_MATCHES, DEMO_PROBLEM } from '../../data/mockData';
import { cn } from '../../lib/utils';
import type { UniversityMatch } from '../../types';
import { containerVariants, cardVariants, MOTION } from '../../config/motion';

const FACTOR_WEIGHTS = [
  { key: 'domainExpertise',  label: 'Domain Expertise',  weight: 35 },
  { key: 'location',         label: 'Location',          weight: 20 },
  { key: 'facultyExpertise', label: 'Faculty Expertise',  weight: 15 },
  { key: 'previousProjects', label: 'Previous Projects',  weight: 10 },
  { key: 'infrastructure',   label: 'Infrastructure',     weight: 10 },
  { key: 'capacity',         label: 'Student Capacity',   weight: 10 },
];

const rankColors = ['bg-yellow-400', 'bg-surface-300', 'bg-amber-600'];

export default function AIMatching() {
  const { addToast } = useApp();
  const [matches, setMatches] = useState<UniversityMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [allocated, setAllocated] = useState<string | null>(null);
  const [allocating, setAllocating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState('');

  useEffect(() => {
    universityService.getMatches(DEMO_PROBLEM.id).then(m => {
      setMatches(m);
      setLoading(false);
    });
  }, []);

  const handleAllocate = async (universityId: string) => {
    setAllocating(true);
    try {
      const isOverride = universityId !== matches[0]?.universityId;
      await universityService.allocate(DEMO_PROBLEM.id, universityId, 'Rajesh Kumar IAS', isOverride ? overrideReason : undefined);
      await problemService.updateStatus(DEMO_PROBLEM.id, 'allocated');
      setAllocated(universityId);
      addToast({ type: 'success', title: 'University Allocated', message: `${matches.find(m=>m.universityId===universityId)?.university.name} has been allocated.` });
    } finally {
      setAllocating(false);
    }
  };

  if (allocated) {
    const uni = matches.find(m => m.universityId === allocated);
    const isAIMatch = allocated === matches[0]?.universityId;
    return (
      <PageTransition>
        <div className="max-w-xl mx-auto mt-8 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-success-500" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-surface-900 mb-2">University Allocated!</h2>
          <p className="text-surface-500 mb-4">{uni?.university.name} has been allocated for problem {DEMO_PROBLEM.id}</p>
          <div className="inline-flex items-center gap-3 px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl mb-4">
            {isAIMatch ? <Badge variant="ai">AI Recommended ✓</Badge> : <Badge variant="warning">Government Override</Badge>}
            <Badge variant="official">Official Decision</Badge>
          </div>
          <p className="text-xs text-surface-400">Allocated by: Rajesh Kumar IAS · {new Date().toLocaleDateString('en-IN')}</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <SectionHeader
        title="AI University Matching"
        subtitle="Problem: Smart Drinking Water Quality Monitoring — Ranchi"
      />

      {/* AI Notice */}
      <div className="mb-6 p-4 bg-ai-50 border border-ai-200 rounded-xl flex items-start gap-3">
        <Cpu size={18} className="text-ai-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-ai-800">AI University Matching Analysis</p>
          <p className="text-xs text-ai-600 mt-0.5">
            AI has ranked universities based on 6 weighted factors. The final allocation decision rests with the Government Officer.
            AI recommendations are advisory only.
          </p>
        </div>
        <Badge variant="ai">AI Suggested</Badge>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-xl" />)}
        </div>
      ) : (
        <motion.div variants={containerVariants(MOTION.stagger.md)} initial="initial" animate="animate" className="space-y-4">
          {matches.map((match, i) => (
            <motion.div key={match.universityId} variants={cardVariants}>
              <Card padding="md" className={cn(match.aiRecommendation && 'ring-2 ring-ai-300 ring-offset-1')}>
                <div className="flex items-start gap-4">
                  {/* Rank Badge */}
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0', rankColors[i] ?? 'bg-surface-300')}>
                    {match.rank}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-surface-900">{match.university.name}</h3>
                          {match.aiRecommendation && <Badge variant="ai" size="sm"><Cpu size={10} /> AI Top Pick</Badge>}
                        </div>
                        <p className="text-xs text-surface-400 mt-0.5">{match.university.type.toUpperCase()} · {match.university.city} · NAAC {match.university.naacGrade}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-extrabold text-surface-900">
                          <AnimatedCounter value={match.matchScore} suffix="%" />
                        </p>
                        <p className="text-xs text-surface-400">match score</p>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="mb-4">
                      <ProgressBar value={match.matchScore} size="md" color={i === 0 ? 'ai' : 'primary'} />
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4 text-xs text-surface-500 mb-3 flex-wrap">
                      <span>👨‍🏫 {match.availableFaculty} faculty available</span>
                      <span>👨‍🎓 {match.availableStudents} students available</span>
                      <span>⏱ {match.estimatedTimeline}</span>
                    </div>

                    {/* Expand Factor Breakdown */}
                    <button
                      onClick={() => setExpanded(expanded === match.universityId ? null : match.universityId)}
                      className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {expanded === match.universityId ? 'Hide' : 'Show'} factor breakdown
                      <ChevronDown size={14} className={cn('transition-transform', expanded === match.universityId && 'rotate-180')} />
                    </button>

                    <AnimatePresence>
                      {expanded === match.universityId && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-surface-100 space-y-2.5">
                            {FACTOR_WEIGHTS.map(f => (
                              <div key={f.key} className="flex items-center gap-3">
                                <span className="text-xs text-surface-500 w-36 shrink-0">{f.label} <span className="text-surface-300">({f.weight}%)</span></span>
                                <div className="flex-1">
                                  <ProgressBar value={(match.factors as any)[f.key]} size="sm" color="primary" />
                                </div>
                                <span className="text-xs font-semibold text-surface-700 w-8 text-right">{(match.factors as any)[f.key]}%</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Government Decision Row */}
                    <div className="mt-4 pt-4 border-t border-surface-100">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-primary-700" />
                          <span className="text-xs font-semibold text-surface-600 uppercase tracking-wide">Government Decision</span>
                        </div>
                        <Button size="sm" variant={i === 0 ? 'primary' : 'outline'} loading={allocating} onClick={() => handleAllocate(match.universityId)}>
                          {i === 0 ? 'Allocate (AI Recommended)' : 'Override & Allocate'}
                        </Button>
                        {i > 0 && (
                          <input
                            className="input text-xs flex-1"
                            placeholder="Reason for override (optional)..."
                            value={overrideReason}
                            onChange={e => setOverrideReason(e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* AI Disclaimer */}
      <div className="mt-6 p-3 bg-ai-50 border border-ai-200 border-dashed rounded-lg">
        <p className="text-xs text-ai-700 italic">
          ⚠ AI recommendations are generated based on domain expertise, location, faculty, previous projects, infrastructure, and capacity.
          They are advisory only. Final allocation authority rests solely with the Government Officer as per platform governance rules.
        </p>
      </div>
    </PageTransition>
  );
}
