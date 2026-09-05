// Government service — verification queue, analytics, audit logs
import type { Problem, AuditEntry } from '../types';
import {
  ANALYTICS_BY_DOMAIN, ANALYTICS_BY_DISTRICT,
  ANALYTICS_MONTHLY, DEMO_AUDIT_LOG, GLOBAL_IMPACT_STATS, DISTRICTS,
} from '../data/mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const governmentService = {
  async getAnalyticsByDomain() {
    await delay(600 + Math.random() * 400);
    return ANALYTICS_BY_DOMAIN;
  },

  async getAnalyticsByDistrict() {
    await delay(600 + Math.random() * 400);
    return ANALYTICS_BY_DISTRICT;
  },

  async getMonthlyAnalytics() {
    await delay(600 + Math.random() * 400);
    return ANALYTICS_MONTHLY;
  },

  async getImpactStats() {
    await delay(500);
    return GLOBAL_IMPACT_STATS;
  },

  async getAuditLog(entityId?: string): Promise<AuditEntry[]> {
    await delay(400 + Math.random() * 300);
    if (entityId) return DEMO_AUDIT_LOG.filter(a => a.entityId === entityId);
    return DEMO_AUDIT_LOG;
  },

  async getDistrictStats() {
    await delay(500);
    return DISTRICTS.map(d => ({
      ...d,
      stats: {
        districtId: d.id,
        problemsSubmitted: Math.floor(Math.random() * 500 + 100),
        problemsVerified: Math.floor(Math.random() * 400 + 80),
        activeProjects: Math.floor(Math.random() * 20 + 2),
        deployedSolutions: Math.floor(Math.random() * 10 + 1),
        citizensImpacted: Math.floor(Math.random() * 50000 + 5000),
      },
    }));
  },
};
