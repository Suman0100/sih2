import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, X, MessageSquare, Droplets, Leaf, Zap, Heart } from 'lucide-react';
import { PageTransition } from '../../components/ui/PageTransition';
import { Card, SectionHeader, SkeletonCard, EmptyState } from '../../components/ui/Card';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { containerVariants, cardVariants } from '../../config/motion';
import { problemService } from '../../services/problemService';
import { useApp } from '../../context/AppContext';
import { SAMPLE_PROBLEMS } from '../../data/mockData';
import { DOMAIN_LABELS, formatDate } from '../../lib/utils';
import type { Problem } from '../../types';

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  water: <Droplets size={18} className="text-cyan-600" />,
  agriculture: <Leaf size={18} className="text-emerald-600" />,
  energy: <Zap size={18} className="text-yellow-600" />,
  healthcare: <Heart size={18} className="text-rose-600" />,
};

export default function UniversityMarketplace() {
  const { addToast } = useApp();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    problemService.getAll({ status: 'allocated' }).then(p => {
      setProblems([...p, ...SAMPLE_PROBLEMS.filter((s: Problem) => s.status === 'verified')]);
      setLoading(false);
    });
  }, []);

  const filtered = problems.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (action: string, p: Problem) => {
    addToast({ type: action === 'accept' ? 'success' : action === 'reject' ? 'error' : 'info', title: action === 'accept' ? `Accepted: ${p.title}` : action === 'reject' ? 'Problem Rejected' : 'Clarification Requested' });
  };

  return (
    <PageTransition>
      <SectionHeader title="Problem Marketplace" subtitle="Browse problems allocated to your university" />
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input className="input pl-9" placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[1,2,3,4].map(i=><SkeletonCard key={i}/>)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<CheckCircle2 size={40}/>} title="No problems available" description="All allocated problems have been accepted." />
      ) : (
        <motion.div variants={containerVariants()} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(p => (
            <motion.div key={p.id} variants={cardVariants} whileHover={{ scale: 1.01 }}>
              <Card padding="md">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-surface-50 rounded-lg shrink-0">
                    {DOMAIN_ICONS[p.domain] ?? <CheckCircle2 size={18} className="text-surface-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-surface-900 truncate">{p.title}</h3>
                    <p className="text-xs text-surface-400">{p.id} · {p.district} · {formatDate(p.submittedAt)}</p>
                  </div>
                </div>
                <p className="text-xs text-surface-600 truncate-2 mb-3">{p.description}</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  <Badge variant="gray" size="sm">{DOMAIN_LABELS[p.domain] ?? p.domain}</Badge>
                  <Badge variant={p.severity === 'critical' ? 'danger' : p.severity === 'high' ? 'warning' : 'gray'} size="sm">{p.severity}</Badge>
                  <span className="text-xs text-surface-400">{p.affectedPopulation.toLocaleString()} people</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="primary" icon={<CheckCircle2 size={14}/>} onClick={() => handleAction('accept', p)}>Accept</Button>
                  <Button size="sm" variant="secondary" icon={<MessageSquare size={14}/>} onClick={() => handleAction('clarify', p)}>Clarify</Button>
                  <Button size="sm" variant="ghost" icon={<X size={14}/>} onClick={() => handleAction('reject', p)}>Reject</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageTransition>
  );
}
