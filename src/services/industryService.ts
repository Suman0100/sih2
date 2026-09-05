// Industry service — collaboration requests, funding
import type { CollaborationRequest, FundingRequest, IndustryPartner } from '../types';
import { INDUSTRY_PARTNERS, DEMO_COLLABORATION, DEMO_FUNDING } from '../data/mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const industryService = {
  async getPartners(): Promise<IndustryPartner[]> {
    await delay(400 + Math.random() * 300);
    return INDUSTRY_PARTNERS;
  },

  async getCollaborationRequests(partnerId?: string): Promise<CollaborationRequest[]> {
    await delay(400 + Math.random() * 300);
    const all = [DEMO_COLLABORATION];
    if (partnerId) return all.filter(c => c.industryPartnerId === partnerId);
    return all;
  },

  async updateCollaborationStatus(
    id: string,
    status: CollaborationRequest['status'],
    response?: string,
    rejectionReason?: string,
  ): Promise<CollaborationRequest> {
    await delay(400);
    return { ...DEMO_COLLABORATION, id, status, response, rejectionReason, respondedAt: new Date().toISOString() };
  },

  async getFundingRequests(partnerId?: string): Promise<FundingRequest[]> {
    await delay(400 + Math.random() * 300);
    return [DEMO_FUNDING];
  },

  async approveFunding(id: string, amount: number): Promise<FundingRequest> {
    await delay(500);
    return { ...DEMO_FUNDING, id, approvedAmount: amount, status: 'approved', approvedAt: new Date().toISOString() };
  },
};
