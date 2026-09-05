import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Cpu, Building2, FlaskConical, Rocket, MapPin, Droplets, Users, Calendar } from 'lucide-react';
import { PageTransition } from '../../components/ui/PageTransition';
import { Card, SectionHeader } from '../../components/ui/Card';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { ProgressBar, ProgressRing } from '../../components/ui/Progress';
import { DEMO_PROBLEM, DEMO_AI_ANALYSIS, DEMO_PROJECT } from '../../data/mockData';
import { formatDate, PHASE_LABELS } from '../../lib/utils';
import { cn } from '../../lib/utils';

const TIMELINE_STAGES = [
  { key: 'submitted',         label: 'Problem Submitted',          icon: <MapPin size={16} />,      status: 'done', date: '15 Aug 2026' },
  { key: 'ai_analysis',       label: 'AI Analysis',                icon: <Cpu size={16} />,          status: 'done', date: '15 Aug 2026', isAI: true },
  { key: 'government_review', label: 'Government Verification',    icon: <CheckCircle2 size={16} />, status: 'done', date: '16 Aug 2026' },
  { key: 'allocated',         label: 'University Allocated',        icon: <Building2 size={16} />,    status: 'done', date: '20 Aug 2026' },
  { key: 'in_progress',       label: 'Research & Development',      icon: <FlaskConical size={16} />, status: 'active', date: 'Sep 2026 – Jan 2027' },
  { key: 'pilot',             label: 'Pilot Deployment',            icon: <Rocket size={16} />,       status: 'pending', date: 'Mar 2027' },
  { key: 'deployed',          label: 'Full Deployment',             icon: <CheckCircle2 size={16} />, status: 'pending', date: 'Apr 2027' },
];

export default function TrackStatus() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(v => v < TIMELINE_STAGES.length ? v + 1 : v);
    }, 250);
    return () => clearInterval(timer);
  }, []);

  return (
    <PageTransition>
      <SectionHeader
        title="Track Problem Status"
        subtitle={`Problem ID: ${DEMO_PROBLEM.id}`}
      />

      {/* Problem Info Card */}
      <Card padding="md" className="mb-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-civic-50 rounded-xl">
            <Droplets size={22} className="text-civic-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-surface-900 mb-1">{DEMO_PROBLEM.title}</h3>
            <div className="flex items-center gap-3 flex-wrap text-xs text-surface-400">
              <span className="font-mono font-medium text-primary-700">{DEMO_PROBLEM.id}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {DEMO_PROBLEM.district}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Users size={12} /> {DEMO_PROBLEM.affectedPopulation.toLocaleString()} people</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(DEMO_PROBLEM.submittedAt)}</span>
            </div>
          </div>
          <StatusBadge status="in_progress" label="In Progress" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card padding="md">
            <h3 className="text-sm font-semibold text-surface-900 mb-5">Journey Timeline</h3>
            <div className="relative">
              {/* Line */}
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-surface-100" />
              <motion.div
                className="absolute left-5 top-5 w-0.5 bg-primary-400"
                initial={{ height: 0 }}
                animate={{ height: `${(Math.min(visible, 4) / 6) * 100}%` }}
                transition={{ duration: 0.4 }}
              />

              <div className="space-y-6 relative">
                {TIMELINE_STAGES.map((stage, i) => {
                  const show = i < visible;
                  const isDone   = stage.status === 'done';
                  const isActive = stage.status === 'active';
                  return (
                    <motion.div
                      key={stage.key}
                      initial={{ opacity: 0, x: -12 }}
                      animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className="flex items-start gap-4"
                    >
                      {/* Icon */}
                      <div className={cn(
                        'w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 relative z-10',
                        isDone   && 'bg-success-500 border-success-500 text-white',
                        isActive && 'bg-primary-600 border-primary-600 text-white',
                        stage.status === 'pending' && 'bg-white border-surface-300 text-surface-400',
                      )}>
                        {stage.icon}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary-300"
                            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={cn('text-sm font-semibold', isDone || isActive ? 'text-surface-900' : 'text-surface-400')}>
                            {stage.label}
                          </p>
                          {stage.isAI && (
                            <span className="text-2xs px-1.5 py-0.5 bg-ai-50 text-ai-700 border border-ai-200 border-dashed rounded-full">AI Generated</span>
                          )}
                          {isDone && <CheckCircle2 size={14} className="text-success-500" />}
                          {isActive && <span className="text-2xs px-1.5 py-0.5 bg-primary-50 text-primary-700 rounded-full font-medium">Active</span>}
                        </div>
                        <p className="text-xs text-surface-400 mt-0.5">{stage.date}</p>

                        {/* AI Analysis detail */}
                        {stage.key === 'ai_analysis' && isDone && (
                          <div className="mt-2 p-3 bg-ai-50 border border-ai-200 rounded-lg">
                            <p className="text-xs text-ai-700 mb-1">
                              Priority Score: <strong>{DEMO_AI_ANALYSIS.priorityScore}/100</strong> ·
                              Severity: <strong>Critical</strong> ·
                              Duplicate probability: <strong>{DEMO_AI_ANALYSIS.duplicateProbability}%</strong>
                            </p>
                            <p className="text-2xs text-ai-600 italic">{DEMO_AI_ANALYSIS.disclaimer}</p>
                          </div>
                        )}

                        {/* Progress for active phase */}
                        {stage.key === 'in_progress' && isActive && (
                          <div className="mt-2">
                            <p className="text-xs text-surface-500 mb-1">University: <strong>BIT Sindri</strong> · Team: <strong>AquaGuard (4 members)</strong></p>
                            <ProgressBar value={52} size="sm" color="primary" label="Overall Progress" showLabel />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Progress Ring */}
          <Card padding="md">
            <h4 className="text-sm font-semibold text-surface-900 mb-4">Solution Progress</h4>
            <div className="flex items-center gap-4">
              <ProgressRing value={52} size={80} color="#2563eb">
                <span className="text-sm font-bold text-surface-900">52%</span>
              </ProgressRing>
              <div className="space-y-1.5">
                {[
                  { label: 'Research',    pct: 100, color: 'success' as const },
                  { label: 'Design',      pct: 100, color: 'success' as const },
                  { label: 'Prototype',   pct: 72,  color: 'primary' as const },
                  { label: 'Testing',     pct: 0,   color: 'primary' as const },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-2">
                    <span className="text-xs text-surface-500 w-16">{m.label}</span>
                    <ProgressBar value={m.pct} size="sm" color={m.color} className="w-24" />
                    <span className="text-xs font-medium text-surface-600">{m.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* AI Analysis Summary */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={14} className="text-ai-600" />
              <h4 className="text-sm font-semibold text-surface-900">AI Analysis</h4>
              <Badge variant="ai" size="sm">AI Suggested</Badge>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-surface-500">Priority Score</span>
                <span className="font-bold text-surface-900">{DEMO_AI_ANALYSIS.priorityScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Severity</span>
                <Badge variant="danger" size="sm">Critical</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">AI Confidence</span>
                <span className="font-medium text-surface-700">{DEMO_AI_ANALYSIS.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Duplicate Risk</span>
                <span className="font-medium text-surface-700">{DEMO_AI_ANALYSIS.duplicateProbability}%</span>
              </div>
            </div>
            <p className="text-2xs text-ai-600 mt-3 italic">{DEMO_AI_ANALYSIS.disclaimer}</p>
          </Card>

          {/* Funding Info */}
          <Card padding="md">
            <h4 className="text-sm font-semibold text-surface-900 mb-3">Industry Support</h4>
            <div className="p-2 bg-success-50 rounded-lg mb-2">
              <p className="text-xs font-semibold text-success-700">AquaTech Solutions</p>
              <p className="text-xs text-success-600">₹3,50,000 funding approved</p>
            </div>
            <ProgressBar value={36} size="sm" color="success" label="Funds Utilized" showLabel />
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
