// Notification service
import type { Notification, NotificationType } from '../types';
import { SAMPLE_NOTIFICATIONS } from '../data/mockData';

const STORAGE_KEY = 'jansamadhan_notifications';
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function getAll(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_NOTIFICATIONS));
  return SAMPLE_NOTIFICATIONS;
}

function save(notifications: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export const notificationService = {
  async getForUser(userId: string): Promise<Notification[]> {
    await delay(300);
    return getAll().filter(n => n.userId === userId);
  },

  async markRead(id: string): Promise<void> {
    const all = getAll();
    const idx = all.findIndex(n => n.id === id);
    if (idx !== -1) { all[idx].read = true; save(all); }
  },

  async markAllRead(userId: string): Promise<void> {
    const all = getAll().map(n => n.userId === userId ? { ...n, read: true } : n);
    save(all);
  },

  async push(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> {
    const all = getAll();
    const n: Notification = {
      ...notification,
      id: `n${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    save([n, ...all]);
    return n;
  },

  getUnreadCount(userId: string): number {
    return getAll().filter(n => n.userId === userId && !n.read).length;
  },
};
