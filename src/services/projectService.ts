// Project service — milestones, team management
import type { Project, Team, Task, ResearchEntry, Prototype, Milestone } from '../types';
import { DEMO_PROJECT, DEMO_TEAM, DEMO_PROTOTYPE } from '../data/mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const PROJECTS_KEY = 'jansamadhan_projects';
const TASKS_KEY    = 'jansamadhan_tasks';

function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const initial = [DEMO_PROJECT];
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(initial));
  return initial;
}

function saveProjects(p: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(p));
}

const DEMO_TASKS: Task[] = [
  { id: 't1', projectId: 'proj-001', milestoneId: 'm5', title: 'Sensor node hardware assembly', description: 'Assemble 5 prototype sensor nodes with pH, TDS, turbidity sensors.', assignedTo: 's2', status: 'completed', priority: 'high', dueDate: '2026-11-30', completedAt: '2026-11-28', tags: ['hardware', 'sensor'] },
  { id: 't2', projectId: 'proj-001', milestoneId: 'm5', title: 'MQTT broker configuration on AWS IoT Core', description: 'Set up AWS IoT Core MQTT broker for sensor data ingestion.', assignedTo: 's3', status: 'completed', priority: 'high', dueDate: '2026-12-10', completedAt: '2026-12-08', tags: ['cloud', 'MQTT'] },
  { id: 't3', projectId: 'proj-001', milestoneId: 'm5', title: 'Dashboard UI — real-time chart components', description: 'Build React dashboard with real-time water quality charts.', assignedTo: 's3', status: 'in_progress', priority: 'high', dueDate: '2027-01-05', tags: ['frontend', 'dashboard'] },
  { id: 't4', projectId: 'proj-001', milestoneId: 'm5', title: 'Field calibration of sensors', description: 'Calibrate sensors against lab-certified water samples.', assignedTo: 's4', status: 'in_progress', priority: 'high', dueDate: '2027-01-10', tags: ['field', 'calibration'] },
  { id: 't5', projectId: 'proj-001', milestoneId: 'm5', title: 'SMS alert system integration', description: 'Integrate Twilio SMS alerts for threshold exceedances.', assignedTo: 's1', status: 'todo', priority: 'medium', dueDate: '2027-01-12', tags: ['alerts', 'SMS'] },
  { id: 't6', projectId: 'proj-001', milestoneId: 'm5', title: 'Community feedback survey design', description: 'Design and digitize survey for villager feedback on prototype.', assignedTo: 's4', status: 'todo', priority: 'low', dueDate: '2027-01-15', tags: ['survey', 'community'] },
];

const DEMO_RESEARCH: ResearchEntry[] = [
  { id: 'r1', projectId: 'proj-001', type: 'site_visit', title: 'Initial Site Visit — Hesag Panchayat', date: '2026-09-20', location: 'Hesag Panchayat, Kanke, Ranchi', participants: 4, findings: 'Identified 3 hand-pump locations. Collected water samples. pH: 8.2, TDS: 890 ppm (above WHO limit). Fluoride: 2.3 mg/L (above 1.5 mg/L limit). Community highly cooperative.', conductedBy: 'Team AquaGuard' },
  { id: 'r2', projectId: 'proj-001', type: 'survey', title: 'Community Health Impact Survey', date: '2026-09-22', location: 'Hesag Panchayat', participants: 87, findings: '73% households report water-related illness in last 6 months. 89% unaware of water quality standards. 94% willing to adopt monitoring solution.', conductedBy: 'Anjali Devi' },
  { id: 'r3', projectId: 'proj-001', type: 'data_collection', title: 'Water Quality Lab Analysis', date: '2026-10-01', location: 'BIT Sindri Environmental Lab', findings: 'Lab confirmed: Fluoride 2.3 mg/L, Arsenic 0.012 mg/L (WHO limit 0.01), Coliform bacteria: 4 CFU/100mL. E-Coli detected in 1 sample. Urgent remediation required.', conductedBy: 'Anjali Devi, Dr. Vinod Mishra' },
  { id: 'r4', projectId: 'proj-001', type: 'interview', title: 'ASHA Worker & Panchayat Head Interviews', date: '2026-10-05', location: 'Hesag Panchayat', participants: 5, findings: 'ASHA workers identified 45+ children with dental fluorosis. Panchayat head requests real-time monitoring and automatic govt. alerts. Existing water purifier broken since 2 years.', conductedBy: 'Arjun Singh' },
];

export const projectService = {
  async getAll(): Promise<Project[]> {
    await delay(400 + Math.random() * 300);
    return getProjects();
  },

  async getById(id: string): Promise<Project | null> {
    await delay(300);
    return getProjects().find(p => p.id === id) ?? null;
  },

  async getTeam(projectId: string): Promise<Team | null> {
    await delay(400);
    if (projectId === 'proj-001') return DEMO_TEAM;
    return null;
  },

  async getTasks(projectId: string): Promise<Task[]> {
    await delay(300);
    return DEMO_TASKS.filter(t => t.projectId === projectId);
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    await delay(200);
    const task = DEMO_TASKS.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');
    Object.assign(task, updates);
    return task;
  },

  async getResearch(projectId: string): Promise<ResearchEntry[]> {
    await delay(400);
    return DEMO_RESEARCH.filter(r => r.projectId === projectId);
  },

  async getPrototype(projectId: string): Promise<Prototype | null> {
    await delay(400);
    if (projectId === 'proj-001') return DEMO_PROTOTYPE;
    return null;
  },

  async updateMilestone(projectId: string, milestoneId: string, updates: Partial<Milestone>): Promise<Project> {
    await delay(300);
    const projects = getProjects();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) throw new Error('Project not found');
    const mIdx = proj.milestones.findIndex(m => m.id === milestoneId);
    if (mIdx !== -1) proj.milestones[mIdx] = { ...proj.milestones[mIdx], ...updates };
    saveProjects(projects);
    return proj;
  },
};
