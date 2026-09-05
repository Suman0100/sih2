import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ArrowRight, Droplets, AlertCircle } from 'lucide-react';
import { PageTransition } from '../../components/ui/PageTransition';
import { Card, StatCard, SectionHeader, SkeletonCard } from '../../components/ui/Card';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { ProgressBar, ProgressRing } from '../../components/ui/Progress';
import { containerVariants, cardVariants, MOTION } from '../../config/motion';
import { DEMO_PROJECT, DEMO_TEAM } from '../../data/mockData';
import { PHASE_LABELS } from '../../lib/utils';

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 600); }, []);

  return (
    <PageTransition>
      <SectionHeader title="My Dashboard" subtitle="Team AquaGuard · BIT Sindri · Water Quality Project" />

      <motion.div variants={containerVariants(MOTION.stagger.sm)} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tasks Pending',    value: 2, icon: <Clock size={18} />,       color: 'yellow' as const },
          { label: 'Tasks Done',       value: 2, icon: <CheckCircle2 size={18}/>, color: 'green'  as const },
          { label: 'Prototype Ready',  value: '72%', icon: <Droplets size={18}/>, color: 'teal'   as const },
          { label: 'Days to Deadline', value: 47, icon: <AlertCircle size={18}/>, color: 'blue'   as const },
        ].map((k, i) => (
          <motion.div key={i} variants={cardVariants}>
            {loading ? <SkeletonCard lines={1} /> : <StatCard {...k} />}
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <Card padding="md">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Project Progress</h3>
          <div className="flex items-center gap-6 mb-5">
            <ProgressRing value={DEMO_PROJECT.overallProgress} size={72} color="#2563eb">
              <span className="text-sm font-bold text-surface-900">{DEMO_PROJECT.overallProgress}%</span>
            </ProgressRing>
            <div className="space-y-2 flex-1">
              {DEMO_PROJECT.milestones.slice(0, 4).map(m => (
                <div key={m.id} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${m.status === 'completed' ? 'bg-success-500' : m.status === 'in_progress' ? 'bg-primary-500 animate-pulse-dot' : 'bg-surface-300'}`} />
                  <span className="text-xs text-surface-600 flex-1 truncate">{PHASE_LABELS[m.phase]}</span>
                  <span className="text-xs font-semibold text-surface-700">{m.progress}%</span>
                </div>
              ))}
            </div>
          </div>
          <ProgressBar value={DEMO_PROJECT.overallProgress} size="md" label="Overall Progress" showLabel />
          <div className="mt-3 flex gap-2">
            <Link to="/student/tasks"><button className="btn-primary btn-sm">View Tasks</button></Link>
            <Link to="/student/prototype"><button className="btn-secondary btn-sm">Prototype</button></Link>
          </div>
        </Card>

        {/* My Team */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-900">Team AquaGuard</h3>
            <Link to="/student/team" className="text-xs text-primary-600 font-medium">View all <ArrowRight size={12} className="inline" /></Link>
          </div>
          <div className="space-y-3">
            {DEMO_TEAM.members.map(m => (
              <div key={m.studentId} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                  {m.student.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 truncate">{m.student.name}</p>
                  <p className="text-xs text-surface-400 truncate">{m.role}</p>
                </div>
                <Badge variant="success" size="sm">Available</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
