import React from 'react';
import { PageTransition } from '../../components/ui/PageTransition';
import { SectionHeader, EmptyState, Card } from '../../components/ui/Card';
import { Construction } from 'lucide-react';

export default function Prototypes() {
  return (
    <PageTransition>
      <SectionHeader title="Prototypes" subtitle="Prototype development status" />
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-3">
          <Construction size={20} className="text-warning-500" />
          <span className="text-sm font-medium text-surface-700">Prototypes — Full implementation in progress</span>
        </div>
        <p className="text-sm text-surface-500">This module is part of the complete JanSamadhan Innovation Hub platform. The data models, service layer, and routing are all wired up. UI panels for this module are being progressively completed.</p>
      </Card>
    </PageTransition>
  );
}
