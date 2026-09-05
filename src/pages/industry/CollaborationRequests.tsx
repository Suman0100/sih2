import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, X, MessageSquare, DollarSign, Users } from 'lucide-react';
import { PageTransition } from '../../components/ui/PageTransition';
import { Card, SectionHeader, SkeletonCard, EmptyState } from '../../components/ui/Card';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { containerVariants, cardVariants } from '../../config/motion';
import { industryService } from '../../services/industryService';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../lib/utils';
import type { CollaborationRequest } from '../../types';

export default function CollaborationRequests() {
  const { addToast } = useApp();
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CollaborationRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    industryService.getCollaborationRequests('i1').then(r => { setRequests(r); setLoading(false); });
  }, []);

  const STATUS_MAP: Record<CollaborationRequest['status'], { label: string; variant: any }> = {
    pending:            { label: 'Pending',            variant: 'warning' },
    accepted:           { label: 'Accepted',           variant: 'success' },
    rejected:           { label: 'Rejected',           variant: 'danger'  },
    meeting_requested:  { label: 'Meeting Requested',  variant: 'primary' },
    mentoring:          { label: 'Mentoring',          variant: 'civic'   },
    funding_offered:    { label: 'Funding Offered',    variant: 'success' },
    completed:          { label: 'Completed',          variant: 'gray'    },
  };

  const handleAction = async (action: CollaborationRequest['status'], req: CollaborationRequest) => {
    setActionLoading(true);
    try {
      await industryService.updateCollaborationStatus(req.id, action, undefined, rejectionReason);
      setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: action } : r));
      addToast({ type: action === 'rejected' ? 'error' : 'success', title: `Request ${action.replace('_', ' ')}` });
      setModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PageTransition>
      <SectionHeader title="Collaboration Requests" subtitle={`${requests.filter(r => r.status === 'pending').length} pending requests`} />

      {loading ? (
        <div className="space-y-3">{[1,2].map(i=><SkeletonCard key={i}/>)}</div>
      ) : requests.length === 0 ? (
        <EmptyState icon={<Users size={40}/>} title="No collaboration requests yet" description="University teams will send requests when they need industry support." />
      ) : (
        <motion.div variants={containerVariants()} initial="initial" animate="animate" className="space-y-4">
          {requests.map(req => {
            const sm = STATUS_MAP[req.status];
            return (
              <motion.div key={req.id} variants={cardVariants}>
                <Card padding="md">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-surface-900">{req.project}</h3>
                      <p className="text-xs text-surface-400">Requested {formatDate(req.requestedAt)}</p>
                    </div>
                    <Badge variant={sm.variant}>{sm.label}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {req.requestType.map(t => (
                      <Badge key={t} variant="gray" size="sm">{t}</Badge>
                    ))}
                  </div>

                  <div className="p-3 bg-surface-50 rounded-lg text-xs text-surface-600 mb-4">
                    {req.message}
                  </div>

                  {req.response && (
                    <div className="p-3 bg-success-50 border border-success-200 rounded-lg text-xs text-success-700 mb-4">
                      <span className="font-semibold">Your response: </span>{req.response}
                    </div>
                  )}

                  {req.status === 'pending' && (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="primary" icon={<CheckCircle2 size={14}/>} loading={actionLoading} onClick={() => handleAction('accepted', req)}>Accept</Button>
                      <Button size="sm" variant="civic" icon={<MessageSquare size={14}/>} loading={actionLoading} onClick={() => handleAction('meeting_requested', req)}>Request Meeting</Button>
                      <Button size="sm" variant="secondary" icon={<DollarSign size={14}/>} loading={actionLoading} onClick={() => handleAction('funding_offered', req)}>Offer Funding</Button>
                      <Button size="sm" variant="ghost" icon={<X size={14}/>} onClick={() => { setSelected(req); setModalOpen(true); }}>Reject</Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Rejection Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Reject Collaboration Request" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-surface-600">Please provide a reason for rejecting this collaboration request (optional but recommended):</p>
          <textarea
            className="input h-24 resize-none"
            placeholder="e.g. Outside our domain expertise, resource constraints..."
            value={rejectionReason}
            onChange={e => setRejectionReason(e.target.value)}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="danger" loading={actionLoading} onClick={() => selected && handleAction('rejected', selected)}>Confirm Rejection</Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
