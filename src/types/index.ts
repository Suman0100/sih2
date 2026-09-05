// All TypeScript interfaces for JanSamadhan Innovation Hub
// Structured to closely match a future real backend schema

// ─── Auth & Roles ────────────────────────────────────────────────────────────

export type UserRole =
  | 'citizen'
  | 'government'
  | 'university'
  | 'faculty'
  | 'student'
  | 'industry';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  // Role-specific profile id
  profileId: string;
}

// ─── Domain & Location ───────────────────────────────────────────────────────

export type ProblemDomain =
  | 'education'
  | 'healthcare'
  | 'agriculture'
  | 'water'
  | 'sanitation'
  | 'environment'
  | 'energy'
  | 'livelihoods'
  | 'accessibility'
  | 'infrastructure'
  | 'public_services';

export interface District {
  id: string;
  name: string;
  division: string;
  population: number;
  coordinates: { lat: number; lng: number };
  stats?: DistrictStats;
}

export interface DistrictStats {
  districtId: string;
  problemsSubmitted: number;
  problemsVerified: number;
  activeProjects: number;
  deployedSolutions: number;
  citizensImpacted: number;
}

// ─── Problem ─────────────────────────────────────────────────────────────────

export type ProblemStatus =
  | 'submitted'
  | 'ai_analysis'
  | 'government_review'
  | 'verified'
  | 'rejected'
  | 'duplicate'
  | 'matching'
  | 'allocated'
  | 'in_progress'
  | 'testing'
  | 'pilot'
  | 'deployed';

export type ProblemSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ProblemPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Problem {
  id: string;           // e.g. "JH-2026-00125"
  title: string;
  description: string;
  domain: ProblemDomain;
  subcategory: string;
  status: ProblemStatus;
  severity: ProblemSeverity;
  priority: ProblemPriority;

  // Location
  districtId: string;
  district: string;
  block?: string;
  village?: string;
  coordinates?: { lat: number; lng: number };

  // Citizen submission
  citizenId: string;
  citizenName: string;
  submittedAt: string;

  // AI analysis
  aiAnalysis?: AIAnalysis;

  // Government
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  governmentDecision?: 'approved' | 'rejected' | 'more_info' | 'duplicate';

  // Allocation
  allocation?: Allocation;

  // Impact
  affectedPopulation: number;
  evidence?: string[];   // file names/URLs

  tags: string[];
  updatedAt: string;
}

// ─── AI Analysis ─────────────────────────────────────────────────────────────

export interface AIAnalysis {
  problemId: string;
  analyzedAt: string;

  // Classification
  domain: ProblemDomain;
  subcategory: string;
  tags: string[];

  // Scores (0–100)
  priorityScore: number;
  severityLevel: ProblemSeverity;
  confidence: number;          // 0–100%
  duplicateProbability: number; // 0–100%

  // Context
  affectedPopulation: number;
  estimatedImpact: string;
  recommendedExpertise: string[];
  suggestedApproach: string;

  // Matches (if duplicate detected)
  similarProblems?: Array<{ id: string; title: string; similarity: number }>;

  // Disclaimer: always shown in UI
  disclaimer: string;
}

// ─── University Match ─────────────────────────────────────────────────────────

export interface UniversityMatch {
  problemId: string;
  universityId: string;
  university: University;

  // Overall score 0–100
  matchScore: number;

  // Weighted factor breakdown (must sum to 100)
  factors: {
    domainExpertise:  number; // weight 35%
    location:         number; // weight 20%
    facultyExpertise: number; // weight 15%
    previousProjects: number; // weight 10%
    infrastructure:   number; // weight 10%
    capacity:         number; // weight 10%
  };

  availableFaculty: number;
  availableStudents: number;
  estimatedTimeline: string; // e.g. "6–8 months"
  aiRecommendation: boolean; // true = AI recommended this one
  rank: number;              // 1 = top match

  // AI disclaimer applies here too
}

// ─── Allocation ───────────────────────────────────────────────────────────────

export interface Allocation {
  id: string;
  problemId: string;
  universityId: string;
  university: string;

  // AI vs. Government decision
  aiRecommendedUniversityId: string;
  governmentSelectedUniversityId: string;
  overrideReason?: string;         // if government overrode AI

  allocatedBy: string;             // officer name
  allocatedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';

  // Audit
  auditLog: AuditEntry[];
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  entityType: 'problem' | 'allocation' | 'project' | 'funding' | 'deployment';
  entityId: string;
  action: string;
  performedBy: string;
  role: UserRole;
  timestamp: string;
  details: string;
  aiRecommendation?: string;
  governmentDecision?: string;
}

// ─── University & Stakeholders ─────────────────────────────────────────────────

export interface University {
  id: string;
  name: string;
  shortName: string;
  type: 'government' | 'private' | 'deemed' | 'central';
  city: string;
  districtId: string;
  established: number;
  naacGrade: string;
  domains: ProblemDomain[];
  facultyCount: number;
  studentCount: number;
  activeProjects: number;
  completedProjects: number;
  logo?: string;
  contact: { email: string; phone: string; website: string };
}

export interface Faculty {
  id: string;
  universityId: string;
  name: string;
  designation: string;
  department: string;
  specializations: string[];
  experience: number;
  publications: number;
  activeProjects: number;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  universityId: string;
  name: string;
  enrollmentNo: string;
  year: number;
  program: string;
  department: string;
  skills: string[];
  cgpa?: number;
  email: string;
  avatar?: string;
  availability: 'available' | 'busy' | 'unavailable';
}

export interface IndustryPartner {
  id: string;
  name: string;
  type: 'startup' | 'msme' | 'corporate' | 'csr' | 'ngo';
  sector: string;
  city: string;
  domains: ProblemDomain[];
  collaborationTypes: Array<'mentorship' | 'funding' | 'technical' | 'testing' | 'deployment'>;
  totalFunding: number;    // in INR
  activeCollaborations: number;
  contact: { email: string; phone: string; website?: string };
  logo?: string;
}

// ─── Project & Team ────────────────────────────────────────────────────────────

export type ProjectPhase =
  | 'problem_understanding'
  | 'field_research'
  | 'requirement_analysis'
  | 'solution_design'
  | 'prototype'
  | 'testing'
  | 'pilot'
  | 'deployment';

export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  problemId: string;
  problem: string;
  universityId: string;
  university: string;
  facultyId: string;
  faculty: string;
  teamId: string;
  domain: ProblemDomain;
  status: ProjectStatus;
  currentPhase: ProjectPhase;
  startDate: string;
  estimatedEndDate: string;
  milestones: Milestone[];
  overallProgress: number; // 0–100
  districtId: string;
  district: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  phase: ProjectPhase;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  completedAt?: string;
  progress: number; // 0–100
  documents: string[];
  comments: Comment[];
  deliverables: string[];
}

export interface Team {
  id: string;
  projectId: string;
  name: string;
  members: TeamMember[];
  createdAt: string;
}

export interface TeamMember {
  studentId: string;
  student: Student;
  role: string;
  joinedAt: string;
  tasks: string[];
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  projectId: string;
  milestoneId: string;
  title: string;
  description: string;
  assignedTo: string; // studentId
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completedAt?: string;
  tags: string[];
}

// ─── Research & Prototype ─────────────────────────────────────────────────────

export interface ResearchEntry {
  id: string;
  projectId: string;
  type: 'site_visit' | 'survey' | 'interview' | 'data_collection' | 'analysis';
  title: string;
  date: string;
  location?: string;
  participants?: number;
  findings: string;
  photos?: string[];
  documents?: string[];
  conductedBy: string;
}

export interface Prototype {
  id: string;
  projectId: string;
  version: string;
  title: string;
  description: string;
  architecture?: string;
  techStack: string[];
  screenshots?: string[];
  demoUrl?: string;
  repoUrl?: string;
  readinessScore: number; // 0–100
  status: 'draft' | 'development' | 'testing' | 'ready' | 'deployed';
  updatedAt: string;
}

// ─── Collaboration & Funding ───────────────────────────────────────────────────

export type CollaborationStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'meeting_requested'
  | 'mentoring'
  | 'funding_offered'
  | 'completed';

export interface CollaborationRequest {
  id: string;
  projectId: string;
  project: string;
  industryPartnerId: string;
  industryPartner: string;
  requestType: Array<'mentorship' | 'funding' | 'technical' | 'testing'>;
  status: CollaborationStatus;
  requestedAt: string;
  respondedAt?: string;
  message: string;
  response?: string;
  rejectionReason?: string;
  meetingDate?: string;
}

export interface FundingRequest {
  id: string;
  projectId: string;
  project: string;
  industryPartnerId: string;
  industryPartner: string;
  requestedAmount: number;  // INR
  approvedAmount?: number;
  utilizedAmount?: number;
  status: 'pending' | 'approved' | 'partially_approved' | 'rejected' | 'completed';
  purpose: string;
  milestones: FundingMilestone[];
  requestedAt: string;
  approvedAt?: string;
}

export interface FundingMilestone {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'released' | 'utilized';
}

// ─── Pilot & Deployment ────────────────────────────────────────────────────────

export type PilotStage = 'planning' | 'installation' | 'testing' | 'live';

export interface Pilot {
  id: string;
  projectId: string;
  stage: PilotStage;
  location: string;
  districtId: string;
  startDate: string;
  endDate?: string;
  metrics: PilotMetric[];
  successScore: number; // 0–100
  beneficiaries: number;
  feedback: Feedback[];
  status: 'active' | 'completed' | 'failed';
}

export interface PilotMetric {
  name: string;
  value: number;
  unit: string;
  target: number;
}

export interface Deployment {
  id: string;
  projectId: string;
  pilotId: string;
  problem: string;
  location: string;
  districtId: string;
  deployedAt: string;
  responsibleOrg: string;
  techPartner: string;
  maintenanceStatus: 'active' | 'scheduled' | 'pending';
  maintenanceNextDate?: string;
  citizensImpacted: number;
  status: 'live' | 'scaling' | 'maintained';
  governmentApprovedBy: string;
  approvedAt: string;
  metrics: PilotMetric[];
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'ai_update'
  | 'government_action'
  | 'collaboration'
  | 'funding'
  | 'deployment';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

// ─── Analytics ─────────────────────────────────────────────────────────────────

export interface ImpactMetric {
  label: string;
  value: number;
  unit?: string;
  trend?: number; // % change
  description?: string;
}

export interface Feedback {
  id: string;
  entityType: 'project' | 'pilot' | 'deployment';
  entityId: string;
  fromRole: UserRole;
  fromName: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}
