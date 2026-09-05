// University service — matching, allocation
import type { University, UniversityMatch, Allocation } from '../types';
import { UNIVERSITIES, DEMO_UNIVERSITY_MATCHES } from '../data/mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const universityService = {
  async getAll(): Promise<University[]> {
    await delay(400 + Math.random() * 400);
    return UNIVERSITIES;
  },

  async getById(id: string): Promise<University | null> {
    await delay(300);
    return UNIVERSITIES.find(u => u.id === id) ?? null;
  },

  async getMatches(problemId: string): Promise<UniversityMatch[]> {
    // Simulate AI matching analysis taking longer
    await delay(1200);
    if (problemId === 'JH-2026-00125') return DEMO_UNIVERSITY_MATCHES;
    // Generate generic matches for other problems
    return UNIVERSITIES.slice(0, 3).map((u, i) => ({
      problemId,
      universityId: u.id,
      university: u,
      matchScore: 90 - i * 6,
      factors: { domainExpertise: 85 - i * 5, location: 80 - i * 8, facultyExpertise: 88 - i * 4, previousProjects: 75 - i * 3, infrastructure: 90 - i * 4, capacity: 85 - i * 5 },
      availableFaculty: 3 - i,
      availableStudents: 15 - i * 3,
      estimatedTimeline: `${6 + i * 2}–${8 + i * 2} months`,
      aiRecommendation: i === 0,
      rank: i + 1,
    }));
  },

  async allocate(problemId: string, universityId: string, officerName: string, overrideReason?: string): Promise<Allocation> {
    await delay(500);
    const aiMatch = DEMO_UNIVERSITY_MATCHES[0];
    return {
      id: `alloc-${Date.now()}`,
      problemId,
      universityId,
      university: UNIVERSITIES.find(u => u.id === universityId)?.name ?? '',
      aiRecommendedUniversityId: aiMatch?.universityId ?? universityId,
      governmentSelectedUniversityId: universityId,
      overrideReason,
      allocatedBy: officerName,
      allocatedAt: new Date().toISOString(),
      status: 'pending',
      auditLog: [],
    };
  },
};
