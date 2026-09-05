import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import {
  X, Eye, EyeOff, Users, ShieldCheck, Building2, BookOpen,
  Handshake, Loader2, CheckCircle2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import { backdropVariants, modalVariants } from '../../config/motion';
import type { UserRole } from '../../types';

// ─── Role catalogue ──────────────────────────────────────────────────────────

export type EcoRoleKey = 'citizen' | 'government' | 'university' | 'faculty' | 'company';

interface RoleMeta {
  key:         EcoRoleKey;
  /** Maps to UserRole used by authService.login() */
  appRole:     UserRole;
  label:       string;
  Icon:        React.ElementType;
  color:       string;   // Tailwind text color
  bg:          string;   // Tailwind bg color (soft)
  border:      string;   // Tailwind border color (active pill)
  ringColor:   string;   // inline ring for avatar
  route:       string;
  demoEmail:   string;
  demoPass:    string;
  person:      string;
  designation: string;
}

const ROLE_META: RoleMeta[] = [
  {
    key: 'citizen', appRole: 'citizen',
    label: 'Citizen', Icon: Users,
    color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-500', ringColor: '#22c55e',
    route: '/citizen/dashboard',
    demoEmail: 'demo.citizen@jih.gov.in', demoPass: 'demo1234',
    person: 'Priya Kumari', designation: 'Resident, Hesag Panchayat, Ranchi',
  },
  {
    key: 'government', appRole: 'government',
    label: 'Government', Icon: ShieldCheck,
    color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-500', ringColor: '#3b82f6',
    route: '/government/dashboard',
    demoEmail: 'demo.government@jih.gov.in', demoPass: 'demo1234',
    person: 'Rajesh Kumar IAS', designation: 'Joint Secretary, Dept. of Higher Education, JH',
  },
  {
    key: 'university', appRole: 'university',
    label: 'University', Icon: Building2,
    color: 'text-civic-600', bg: 'bg-civic-50', border: 'border-civic-500', ringColor: '#0ea5e9',
    route: '/university/dashboard',
    demoEmail: 'demo.university@jih.gov.in', demoPass: 'demo1234',
    person: 'Dr. Anita Sharma', designation: 'Director, BIT Sindri',
  },
  {
    key: 'faculty', appRole: 'faculty',
    label: 'Faculty', Icon: BookOpen,
    color: 'text-ai-600', bg: 'bg-ai-50', border: 'border-ai-500', ringColor: '#a855f7',
    route: '/faculty/dashboard',
    demoEmail: 'demo.faculty@jih.gov.in', demoPass: 'demo1234',
    person: 'Dr. Vinod Mishra', designation: 'Professor, Environmental Engineering, BIT Sindri',
  },
  {
    key: 'company', appRole: 'industry',
    label: 'Company', Icon: Handshake,
    color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-500', ringColor: '#f59e0b',
    route: '/industry/dashboard',
    demoEmail: 'demo.industry@jih.gov.in', demoPass: 'demo1234',
    person: 'Meera Patel', designation: 'CEO, AquaTech Solutions Pvt. Ltd., Ranchi',
  },
];

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.email({ error: 'Enter a valid email' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.email({ error: 'Enter a valid email' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm:  z.string(),
  role:     z.string(),
}).check((ctx) => {
  if (ctx.value.password !== ctx.value.confirm) {
    ctx.issues.push({
      code: 'custom',
      path: ['confirm'],
      message: 'Passwords do not match',
      input: ctx.value,
    });
  }
});

type LoginFields    = z.infer<typeof loginSchema>;
type RegisterFields = z.infer<typeof registerSchema>;

// ─── Props ───────────────────────────────────────────────────────────────────

interface RoleAuthModalProps {
  /** Initial role to pre-select when modal opens */
  initialRole: EcoRoleKey;
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function RoleAuthModal({ initialRole, onClose }: RoleAuthModalProps) {
  const navigate = useNavigate();
  const { login } = useApp();

  const [activeKey, setActiveKey] = useState<EcoRoleKey>(initialRole);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const role = ROLE_META.find(r => r.key === activeKey)!;
  const dialogRef = useRef<HTMLDivElement>(null);

  // ── Keep initialRole in sync when the parent re-opens with a different role
  useEffect(() => { setActiveKey(initialRole); }, [initialRole]);

  // ── Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  // ── Body scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── Focus trap
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const focusables = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])'
        )
      );
    focusables()[0]?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = focusables();
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { last?.focus(); e.preventDefault(); }
      } else {
        if (document.activeElement === last) { first?.focus(); e.preventDefault(); }
      }
    };
    el.addEventListener('keydown', trap);
    return () => el.removeEventListener('keydown', trap);
  }, [mode, activeKey]);

  // ── Login form
  const {
    register: regLogin,
    handleSubmit: handleLogin,
    reset: resetLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: role.demoEmail, password: role.demoPass, remember: true },
  });

  // ── Register form
  const {
    register: regRegister,
    handleSubmit: handleRegister,
    reset: resetRegister,
    formState: { errors: registerErrors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: role.demoEmail, password: '', confirm: '', role: role.appRole },
  });

  // When switching roles, patch the email default so it reflects the new role
  const handleRoleSwitch = useCallback((key: EcoRoleKey) => {
    setActiveKey(key);
    const r = ROLE_META.find(m => m.key === key)!;
    resetLogin({ email: r.demoEmail, password: r.demoPass, remember: true });
    resetRegister({ email: r.demoEmail, password: '', confirm: '', name: '', role: r.appRole });
    setShowPw(false);
    setShowConfirm(false);
  }, [resetLogin, resetRegister]);

  const handleModeSwitch = useCallback((m: 'login' | 'register') => {
    setMode(m);
    setShowPw(false);
    setShowConfirm(false);
  }, []);

  // ── Login submit
  const onLogin = useCallback(() => {
    setSubmitting(true);
    setTimeout(() => {
      login(role.appRole);
      setSubmitting(false);
      setDone(true);
      setTimeout(() => {
        onClose();
        navigate(role.route);
      }, 500);
    }, 600);
  }, [login, navigate, onClose, role]);

  // ── Register submit
  const onRegister = useCallback((_data: RegisterFields) => {
    setSubmitting(true);
    setTimeout(() => {
      login(role.appRole);
      setSubmitting(false);
      setDone(true);
      setTimeout(() => {
        onClose();
        navigate(role.route);
      }, 500);
    }, 600);
  }, [login, navigate, onClose, role]);

  const { Icon } = role;

  return (
    <>
      {/* ── Backdrop */}
      <motion.div
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Modal panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          ref={dialogRef}
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full max-w-md bg-white rounded-2xl shadow-card-lg border border-surface-200 my-auto"
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
        >
          {/* ── Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-surface-100">
            <div>
              <h2 id="auth-modal-title" className="text-base font-semibold text-surface-900">
                {role.label} Portal
              </h2>
              <p className="text-xs text-surface-400 mt-0.5">Demo mode — no auth required</p>
            </div>
            {/* Mode tabs */}
            <div className="flex items-center gap-1 bg-surface-100 rounded-lg p-0.5 mr-8">
              {(['login', 'register'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => handleModeSwitch(m)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium transition-all duration-150',
                    mode === m
                      ? 'bg-white text-surface-900 shadow-card'
                      : 'text-surface-500 hover:text-surface-700'
                  )}
                >
                  {m === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* ── Role icon + welcome */}
            <div className="flex flex-col items-center gap-2 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeKey}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
                  className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', role.bg)}
                >
                  <Icon size={26} className={role.color} />
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeKey}-text`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                >
                  <p className="text-sm font-semibold text-surface-900">
                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                  </p>
                  <p className="text-xs text-surface-500">
                    {mode === 'login' ? `Continue as ${role.label}` : `Register as ${role.label}`}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin(onLogin)} className="space-y-3" noValidate>
                <div>
                  <label htmlFor="login-email" className="label">ID / Email</label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    className={cn('input', loginErrors.email && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500')}
                    {...regLogin('email')}
                  />
                  {loginErrors.email && (
                    <p className="text-xs text-danger-600 mt-1">{loginErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="login-password" className="label">Password</label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={cn('input pr-10', loginErrors.password && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500')}
                      {...regLogin('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-xs text-danger-600 mt-1">{loginErrors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-surface-500">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                      {...regLogin('remember')}
                    />
                    Remember me
                  </label>
                  <button type="button" className="text-primary-600 hover:underline">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting || done}
                  className={cn(
                    'w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98]',
                    'bg-gradient-to-r from-surface-900 to-warning-500 hover:opacity-90',
                    'disabled:opacity-70 disabled:cursor-not-allowed',
                    'flex items-center justify-center gap-2',
                  )}
                >
                  {done
                    ? <><CheckCircle2 size={15} /> Logged in!</>
                    : submitting
                      ? <><Loader2 size={15} className="animate-spin" /> Signing in…</>
                      : 'Login'
                  }
                </button>

                <p className="text-center text-xs text-surface-400">
                  New here?{' '}
                  <button type="button" className="text-primary-600 hover:underline" onClick={() => handleModeSwitch('register')}>
                    Register
                  </button>
                </p>
              </form>
            )}

            {/* ── REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegister(onRegister)} className="space-y-3" noValidate>
                <div>
                  <label htmlFor="reg-name" className="label">Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Arjun Singh"
                    className={cn('input', registerErrors.name && 'border-danger-500')}
                    {...regRegister('name')}
                  />
                  {registerErrors.name && (
                    <p className="text-xs text-danger-600 mt-1">{registerErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-email" className="label">ID / Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    className={cn('input', registerErrors.email && 'border-danger-500')}
                    {...regRegister('email')}
                  />
                  {registerErrors.email && (
                    <p className="text-xs text-danger-600 mt-1">{registerErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-password" className="label">Password</label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min. 6 characters"
                      className={cn('input pr-10', registerErrors.password && 'border-danger-500')}
                      {...regRegister('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {registerErrors.password && (
                    <p className="text-xs text-danger-600 mt-1">{registerErrors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-confirm" className="label">Confirm Password</label>
                  <div className="relative">
                    <input
                      id="reg-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Re-enter password"
                      className={cn('input pr-10', registerErrors.confirm && 'border-danger-500')}
                      {...regRegister('confirm')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {registerErrors.confirm && (
                    <p className="text-xs text-danger-600 mt-1">{registerErrors.confirm.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-role" className="label">Role</label>
                  <select
                    id="reg-role"
                    className="input"
                    {...regRegister('role')}
                  >
                    {ROLE_META.map(r => (
                      <option key={r.key} value={r.appRole}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting || done}
                  className={cn(
                    'w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98]',
                    'bg-gradient-to-r from-surface-900 to-warning-500 hover:opacity-90',
                    'disabled:opacity-70 disabled:cursor-not-allowed',
                    'flex items-center justify-center gap-2',
                  )}
                >
                  {done
                    ? <><CheckCircle2 size={15} /> Account created!</>
                    : submitting
                      ? <><Loader2 size={15} className="animate-spin" /> Creating account…</>
                      : 'Register & Enter'
                  }
                </button>

                <p className="text-center text-xs text-surface-400">
                  Already have an account?{' '}
                  <button type="button" className="text-primary-600 hover:underline" onClick={() => handleModeSwitch('login')}>
                    Login
                  </button>
                </p>
              </form>
            )}

            {/* ── Switch portal pills */}
            <div>
              <p className="text-center text-xs text-surface-400 mb-2">Switch portal:</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {ROLE_META.map(r => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => handleRoleSwitch(r.key)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150',
                      r.key === activeKey
                        ? 'bg-white shadow-card'
                        : 'border-surface-200 text-surface-500 hover:border-surface-300 hover:text-surface-700 bg-white',
                    )}
                    style={r.key === activeKey
                      ? { borderColor: r.ringColor, color: r.ringColor }
                      : {}
                    }
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Demo user preview card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeKey + '-card'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="flex items-center gap-3 p-3 bg-surface-50 border border-surface-100 rounded-xl"
              >
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: role.ringColor }}
                >
                  {role.person.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-surface-800 truncate">{role.person}</p>
                  <p className="text-2xs text-surface-500 truncate">{role.designation}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <p className="text-center text-2xs text-surface-400 leading-relaxed">
              Frontend prototype for SIH 2026 — all data is mock/demo data.
              No real backend or authentication is active.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
