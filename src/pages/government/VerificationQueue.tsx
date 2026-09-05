import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle2, XCircle, MessageSquare, Copy, ChevronDown, AlertTriangle, Cpu } from 'lucide-react';
import { PageTransition } from '../../components/ui/PageTransition';
import { Card, SectionHeader, SkeletonTable, EmptyState } from '../../components/ui/Card';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/ui/Progress';
import { containerVariants, cardVariants } from '../../config/motion';
import { problemService } from '../../services/problemService';
import { useApp } from '../../context/AppContext';
import { formatDate, formatDateTime, STATUS_LABELS, DOMAIN_LABELS } from '../../lib/utils';
import { cn } from '../../lib/utils';
import type { Problem } from '../../types';
import { DEMO_AI_ANALYSIS } from '../../data/mockData';

export default function VerificationQueue() {
  const { addToast } = useApp();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Problem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    problemService.getVerificationQueue().then(p => { setProblems(p); setLoading(false); });
  }, []);

  const filtered = problems.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (search) return p.title.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const handleAction = async (action: 'approve' | 'reject' | 'info' | 'duplicate') => {
    if (!selected) return;
    setActionLoading(true);
    const statusMap = { approve: 'verified', reject: 'rejected', info: 'government_review', duplicate: 'duplicate' } as const;
    try {
      await problemService.updateStatus(selected.id, statusMap[action] as any, {
        verifiedBy: 'Rajesh Kumar IAS', verifiedAt: new Date().toISOString(),
        governmentDecision: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'more_info',
      });
      setProblems(prev => prev.filter(p => p.id !== selected.id));
      setSelected(null);
      const labels = { approve: 'Problem Verified', reject: 'Problem Rejected', info: 'More Info Requested', duplicate: 'Marked as Duplicate' };
      addToast({ type: action === 'approve' ? 'success' : action === 'reject' ? 'error' : 'info', title: labels[action] });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PageTransition>
      <SectionHeader
        title="Verification Queue"
        subtitle={`${filtered.length} problems pending review`}
      />

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input className="input pl-9 text-sm" placeholder="Search by title or ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'submitted', 'ai_analysis', 'government_review'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                filter === f ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
              )}
            >
              {f === 'all' ? 'All' : STATUS_LABELS[f] ?? f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card padding="none">
        {loading ? (
          <SkeletonTable rows={5} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<CheckCircle2 size={40} />} title="Queue is empty" description="All problems have been reviewed — great work!" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="text-left text-xs font-medium text-surface-500 px-4 py-3">Problem</th>
                  <th className="text-left text-xs font-medium text-surface-500 px-4 py-3 hidden sm:table-cell">Domain</th>
                  <th className="text-left text-xs font-medium text-surface-500 px-4 py-3 hidden md:table-cell">District</th>
                  <th className="text-left text-xs font-medium text-surface-500 px-4 py-3 hidden lg:table-cell">Submitted</th>
                  <th className="text-left text-xs font-medium text-surface-500 px-4 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-surface-500 px-4 py-3">Action</th>
                </tr>
              </thead>
              <motion.tbody variants={containerVariants()} initial="initial" animate="animate">
                {filtered.map(p => (
                  <motion.tr key={p.id} variants={cardVariants}
                    className="border-b border-surface-50 hover:bg-surface-50/70 transition-colors cursor-pointer"
                    onClick={() => setSelected(p)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-surface-900 truncate max-w-xs">{p.title}</p>
                      <p className="text-xs text-surface-400 font-mono">{p.id}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="gray" size="sm">{DOMAIN_LABELS[p.domain] ?? p.domain}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-surface-600">{p.district}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-surface-400">{formatDate(p.submittedAt)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} label={STATUS_LABELS[p.status] ?? p.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelected(p)}>Review</Button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Problem Review" width="lg">
        {selected && (
          <div className="p-5 space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <h3 className="text-base font-semibold text-surface-900 flex-1">{selected.title}</h3>
                <StatusBadge status={selected.status} label={STATUS_LABELS[selected.status] ?? selected.status} />
              </div>
              <p className="text-xs text-surface-400 font-mono">{selected.id}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Domain',     value: DOMAIN_LABELS[selected.domain] ?? selected.domain },
                { label: 'District',   value: selected.district },
                { label: 'Severity',   value: selected.severity },
                { label: 'Submitted',  value: formatDate(selected.submittedAt) },
                { label: 'Citizen',    value: selected.citizenName },
                { label: 'Affected',   value: `${selected.affectedPopulation.toLocaleString()} people` },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-surface-50 rounded-lg">
                  <p className="text-2xs text-surface-400 uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-surface-800">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-medium text-surface-500 uppercase tracking-wide mb-1.5">Description</p>
              <p className="text-sm text-surface-700 leading-relaxed">{selected.description}</p>
            </div>

            {/* AI Analysis Panel */}
            {selected.id === 'JH-2026-00125' && (
              <div className="p-4 bg-ai-50 border border-ai-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu size={16} className="text-ai-600" />
                  <h4 className="text-sm font-semibold text-ai-800">AI Analysis</h4>
                  <Badge variant="ai" size="sm">AI Suggested</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                  <div><span className="text-ai-600">Priority Score:</span> <strong className="text-ai-800">{DEMO_AI_ANALYSIS.priorityScore}/100</strong></div>
                  <div><span className="text-ai-600">Confidence:</span> <strong className="text-ai-800">{DEMO_AI_ANALYSIS.confidence}%</strong></div>
                  <div><span className="text-ai-600">Duplicate Risk:</span> <strong className="text-ai-800">{DEMO_AI_ANALYSIS.duplicateProbability}%</strong></div>
                  <div><span className="text-ai-600">Severity:</span> <strong className="text-ai-800">Critical</strong></div>
                </div>
                <p className="text-xs text-ai-700 mb-2">{DEMO_AI_ANALYSIS.suggestedApproach}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {DEMO_AI_ANALYSIS.recommendedExpertise.map(e => (
                    <span key={e} className="text-2xs px-2 py-0.5 bg-ai-100 text-ai-700 rounded-full">{e}</span>
                  ))}
                </div>
                <p className="text-2xs text-ai-600 italic border-t border-ai-200 pt-2">{DEMO_AI_ANALYSIS.disclaimer}</p>
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-surface-100 pt-4">
              <p className="text-xs font-semibold text-surface-600 uppercase tracking-wide mb-3">Government Decision</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="primary" icon={<CheckCircle2 size={16} />} loading={actionLoading} onClick={() => handleAction('approve')}>
                  Verify & Approve
                </Button>
                <Button variant="secondary" icon={<MessageSquare size={16} />} loading={actionLoading} onClick={() => handleAction('info')}>
                  Request More Info
                </Button>
                <Button variant="secondary" icon={<Copy size={16} />} loading={actionLoading} onClick={() => handleAction('duplicate')}>
                  Mark Duplicate
                </Button>
                <Button variant="danger" icon={<XCircle size={16} />} loading={actionLoading} onClick={() => handleAction('reject')}>
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </PageTransition>
  );
}
