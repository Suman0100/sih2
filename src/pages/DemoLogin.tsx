import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, ShieldCheck, Building2, BookOpen, GraduationCap, Handshake,
  ArrowRight, ArrowLeft
} from 'lucide-react';
import { containerVariants, cardVariants, MOTION } from '../config/motion';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';

const ROLES: {
  role: UserRole;
  label: string;
  description: string;
  person: string;
  designation: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  route: string;
  capabilities: string[];
}[] = [
  {
    role: 'citizen',
    label: 'Citizen',
    description: 'Submit community problems and track their resolution journey',
    person: 'Priya Kumari',
    designation: 'Resident, Hesag Panchayat, Ranchi',
    icon: <Users size={28} />,
    color: 'text-success-600',
    gradient: 'from-success-500/20 to-success-600/10',
    route: '/citizen/dashboard',
    capabilities: ['Submit problems', 'Track progress', 'View solutions', 'Receive updates'],
  },
  {
    role: 'government',
    label: 'Government Officer',
    description: 'Verify problems, allocate universities, and monitor impact',
    person: 'Rajesh Kumar IAS',
    designation: 'Joint Secretary, Dept. of Higher Education, Jharkhand',
    icon: <ShieldCheck size={28} />,
    color: 'text-primary-600',
    gradient: 'from-primary-500/20 to-primary-700/10',
    route: '/government/dashboard',
    capabilities: ['Verify problems', 'AI matching', 'Allocate universities', 'Analytics dashboard', 'Audit logs'],
  },
  {
    role: 'university',
    label: 'University Admin',
    description: 'Browse and accept problems, manage faculty and student teams',
    person: 'Dr. Anita Sharma',
    designation: 'Director, BIT Sindri',
    icon: <Building2 size={28} />,
    color: 'text-civic-600',
    gradient: 'from-civic-500/20 to-civic-600/10',
    route: '/university/dashboard',
    capabilities: ['Problem marketplace', 'Team formation', 'Faculty management', 'Industry collaboration'],
  },
  {
    role: 'faculty',
    label: 'Faculty Mentor',
    description: 'Guide student teams through research, prototyping, and deployment',
    person: 'Dr. Vinod Mishra',
    designation: 'Professor, Environmental Engineering, BIT Sindri',
    icon: <BookOpen size={28} />,
    color: 'text-ai-600',
    gradient: 'from-ai-500/20 to-ai-600/10',
    route: '/faculty/dashboard',
    capabilities: ['Project lifecycle', '8-phase milestones', 'Student oversight', 'Industry coordination'],
  },
  {
    role: 'student',
    label: 'Student',
    description: 'Work in multidisciplinary teams to research and build solutions',
    person: 'Arjun Singh',
    designation: 'B.Tech Final Year, Civil Engineering, BIT Sindri',
    icon: <GraduationCap size={28} />,
    color: 'text-warning-600',
    gradient: 'from-warning-400/20 to-warning-600/10',
    route: '/student/dashboard',
    capabilities: ['Task management', 'Field research', 'Prototype tracker', 'Industry requests'],
  },
  {
    role: 'industry',
    label: 'Industry Partner',
    description: 'Discover projects, offer mentorship, funding, and deployment support',
    person: 'Meera Patel',
    designation: 'CEO, AquaTech Solutions Pvt. Ltd., Ranchi',
    icon: <Handshake size={28} />,
    color: 'text-surface-600',
    gradient: 'from-surface-400/20 to-surface-600/10',
    route: '/industry/dashboard',
    capabilities: ['Project discovery', 'Collaboration workspace', 'Funding tracker', 'Pilot deployment'],
  },
];

export default function DemoLogin() {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSelect = (role: UserRole, route: string) => {
    login(role);
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-surface-200 bg-white px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">JS</div>
          <span className="text-sm font-semibold text-surface-900">JanSamadhan</span>
        </div>
        <div className="w-20" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-full text-xs font-medium text-primary-700 mb-4">
            Demo Mode — No authentication required
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">Choose Your Role</h1>
          <p className="text-surface-500 max-w-lg">
            Select a stakeholder role to explore JanSamadhan from their perspective.
            All data is demo/prototype data for SIH 2026.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants(MOTION.stagger.sm)}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full"
        >
          {ROLES.map((r) => (
            <motion.button
              key={r.role}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(r.role, r.route)}
              className={`text-left p-5 rounded-2xl bg-gradient-to-br ${r.gradient} border border-surface-200 hover:border-surface-300 hover:shadow-card-md transition-all duration-200 group`}
            >
              {/* Icon + Role */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 bg-white rounded-xl shadow-card ${r.color}`}>
                  {r.icon}
                </div>
                <ArrowRight size={16} className="text-surface-300 group-hover:text-surface-500 group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Label + description */}
              <h3 className="text-base font-semibold text-surface-900 mb-1">{r.label}</h3>
              <p className="text-xs text-surface-500 mb-4 leading-relaxed">{r.description}</p>

              {/* Persona */}
              <div className="flex items-center gap-2 mb-4 p-2.5 bg-white/60 rounded-lg">
                <div className={`w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs font-bold ${r.color}`}>
                  {r.person.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-surface-800 truncate">{r.person}</p>
                  <p className="text-2xs text-surface-500 truncate">{r.designation}</p>
                </div>
              </div>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-1.5">
                {r.capabilities.slice(0, 3).map(c => (
                  <span key={c} className="text-2xs px-1.5 py-0.5 bg-white/70 border border-surface-200 rounded text-surface-600">{c}</span>
                ))}
                {r.capabilities.length > 3 && (
                  <span className="text-2xs px-1.5 py-0.5 text-surface-400">+{r.capabilities.length - 3} more</span>
                )}
              </div>
            </motion.button>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xs text-surface-400 text-center max-w-md"
        >
          This is a frontend prototype built for SIH 2026. All data is mock/demo data stored in browser LocalStorage.
          No real backend, authentication, or government APIs are active.
        </motion.p>
      </div>
    </div>
  );
}
