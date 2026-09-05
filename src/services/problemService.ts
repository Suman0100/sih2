// Problem service — simulated async API with realistic latency
import type { Problem, ProblemStatus, ProblemDomain } from '../types';
import { DEMO_PROBLEM, SAMPLE_PROBLEMS } from '../data/mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
const randomLatency = () => 400 + Math.random() * 400;

const STORAGE_KEY = 'jansamadhan_problems';

function getStoredProblems(): Problem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Seed with demo + sample data
  const all = [DEMO_PROBLEM, ...SAMPLE_PROBLEMS];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all;
}

function saveProblems(problems: Problem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
}

export const problemService = {
  async getAll(filters?: { domain?: ProblemDomain; status?: ProblemStatus; search?: string }): Promise<Problem[]> {
    await delay(randomLatency());
    let problems = getStoredProblems();
    if (filters?.domain)  problems = problems.filter(p => p.domain === filters.domain);
    if (filters?.status)  problems = problems.filter(p => p.status === filters.status);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      problems = problems.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      );
    }
    return problems;
  },

  async getById(id: string): Promise<Problem | null> {
    await delay(randomLatency());
    return getStoredProblems().find(p => p.id === id) ?? null;
  },

  async submit(data: Omit<Problem, 'id' | 'status' | 'submittedAt' | 'updatedAt'>): Promise<Problem> {
    await delay(600);
    const problems = getStoredProblems();
    const id = `JH-2026-${String(problems.length + 1).padStart(5, '0')}`;
    const now = new Date().toISOString();
    const problem: Problem = { ...data, id, status: 'submitted', submittedAt: now, updatedAt: now };
    saveProblems([problem, ...problems]);
    return problem;
  },

  async updateStatus(id: string, status: ProblemStatus, meta?: Partial<Problem>): Promise<Problem> {
    await delay(400);
    const problems = getStoredProblems();
    const idx = problems.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Problem not found');
    problems[idx] = { ...problems[idx], status, ...meta, updatedAt: new Date().toISOString() };
    saveProblems(problems);
    return problems[idx];
  },

  async getByCitizen(citizenId: string): Promise<Problem[]> {
    await delay(randomLatency());
    return getStoredProblems().filter(p => p.citizenId === citizenId);
  },

  async getVerificationQueue(): Promise<Problem[]> {
    await delay(randomLatency());
    return getStoredProblems().filter(p => ['submitted', 'ai_analysis', 'government_review'].includes(p.status));
  },
};
