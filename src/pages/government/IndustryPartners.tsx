import React from 'react';
import { PageTransition } from '../../components/ui/PageTransition';
import { Card, SectionHeader } from '../../components/ui/Card';
import { INDUSTRY_PARTNERS } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { motion } from 'framer-motion';
import { containerVariants, cardVariants } from '../../config/motion';
import { Handshake, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function IndustryPartners() {
  return (
    <PageTransition>
      <SectionHeader title="Industry Partners" subtitle="Startups, MSMEs, and CSR organizations collaborating on platform" />
      <motion.div variants={containerVariants()} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {INDUSTRY_PARTNERS.map(p => (
          <motion.div key={p.id} variants={cardVariants} whileHover={{ scale: 1.01 }}>
            <Card padding="md">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center">
                  <Handshake size={20} className="text-surface-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-surface-900">{p.name}</h3>
                  <p className="text-xs text-surface-400">{p.sector} · {p.city}</p>
                </div>
                <Badge variant="gray" size="sm">{p.type}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-surface-500">
                <span className="flex items-center gap-1"><DollarSign size={12} /> {formatCurrency(p.totalFunding)} committed</span>
                <span>· {p.activeCollaborations} active</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {p.collaborationTypes.map(t => (
                  <Badge key={t} variant="gray" size="sm">{t}</Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </PageTransition>
  );
}
