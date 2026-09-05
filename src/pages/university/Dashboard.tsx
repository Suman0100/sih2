import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Users, Briefcase, Handshake, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { PageTransition } from '../../components/ui/PageTransition';
import { Card, StatCard, SectionHeader, SkeletonCard } from '../../components/ui/Card';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/Progress';
import { containerVariants, cardVariants, MOTION } from '../../config/motion';
import { DEMO_PROJECT, UNIVERSITIES } from '../../data/mockData';

export default function UniversityDashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  return (
    <PageTransition>
      <SectionHeader title="University Dashboard" subtitle={`${UNIVERSITIES[0].name} — Innovation Portal`} />

      <motion.div variants={containerVariants(MOTION.stagger.sm)} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Projects',   value: 12, icon: <Briefcase size={18} />,   color: 'blue'   as const },
          { label: 'Open Problems',     value: 5,  icon: <Layers size={18} />,       color: 'yellow' as const },
          { label: 'Faculty Mentors',   value: 18, icon: <Users size={18} />,        color: 'teal'   as const },
          { label: 'Industry Partners', value: 3,  icon: <Handshake size={18} />,    color: 'green'  as const },
        ].map((k, i) => (
          <motion.div key={i} variants={cardVariants}>
            {loading ? <SkeletonCard lines={1} /> : <StatCard {...k} />}
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none">
          <div className="flex items-center justify-between p-4 border-b border-surface-100">
            <h3 className="text-sm font-semibold text-surface-900">Active Projects</h3>
            <Link to="/university/projects" className="text-xs text-primary-600 font-medium">View all</Link>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-surface-900">{DEMO_PROJECT.problem}</p>
                <StatusBadge status="in_progress" label="In Progress" />
              </div>
              <ProgressBar value={DEMO_PROJECT.overallProgress} size="sm" showLabel label="Progress" color="primary" />
              <div className="flex gap-2 mt-2 flex-wrap text-xs text-surface-400">
                <span>Phase: Prototype</span>
                <span>· Faculty: Dr. Vinod Mishra</span>
                <span>· 4 students</span>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Browse Problem Marketplace', href: '/university/marketplace', icon: <Layers size={16} />, badge: '5 new' },
              { label: 'Manage Teams',               href: '/university/teams',       icon: <Users size={16} />,  badge: null },
              { label: 'Faculty Overview',           href: '/university/faculty',     icon: <Users size={16} />,  badge: null },
              { label: 'Industry Collaboration',     href: '/university/industry',    icon: <Handshake size={16} />, badge: '1 pending' },
            ].map(item => (
              <Link key={item.href} to={item.href}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-50 transition-colors cursor-pointer">
                  <span className="text-surface-500">{item.icon}</span>
                  <span className="text-sm text-surface-700 flex-1">{item.label}</span>
                  {item.badge && <Badge variant="warning" size="sm">{item.badge}</Badge>}
                  <ArrowRight size={14} className="text-surface-300" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
