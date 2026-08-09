"use client";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, Loader2, TriangleAlert, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export interface ToastItem { id: string; type: ToastType; message: string; }

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => string;
  updateToast: (id: string, message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
  toast: {
    success: (message: string) => string;
    error: (message: string) => string;
    warning: (message: string) => string;
    info: (message: string) => string;
    loading: (message: string) => string;
    update: (id: string, message: string, type?: ToastType) => void;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const toastsRef = useRef<ToastItem[]>([]);

  useEffect(() => () => timers.current.forEach(timer => clearTimeout(timer)), []);

  const dismissToast = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    const next = toastsRef.current.filter(item => item.id !== id);
    toastsRef.current = next;
    setToasts(next);
  }, []);

  const schedule = useCallback((id: string, type: ToastType) => {
    if (type === 'loading') return;
    const existing = timers.current.get(id);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => dismissToast(id), type === 'error' ? 8000 : 2500);
    timers.current.set(id, timer);
  }, [dismissToast]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const safeMessage = String(message || 'Operation completed').slice(0, 280);
    const duplicate = toastsRef.current.find(item => item.message === safeMessage && item.type === type);
    if (duplicate) return duplicate.id;
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    toastsRef.current.slice(0, -4).forEach(item => {
      const timer = timers.current.get(item.id);
      if (timer) clearTimeout(timer);
      timers.current.delete(item.id);
    });
    const next = [...toastsRef.current.slice(-4), { id, type, message: safeMessage }];
    toastsRef.current = next;
    setToasts(next);
    schedule(id, type);
    return id;
  }, [schedule]);

  const updateToast = useCallback((id: string, message: string, type: ToastType = 'success') => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    const next = toastsRef.current.map(item => item.id === id ? { id, type, message: String(message).slice(0, 280) } : item);
    toastsRef.current = next;
    setToasts(next);
    schedule(id, type);
  }, [schedule]);

  const toast = {
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    warning: (message: string) => showToast(message, 'warning'),
    info: (message: string) => showToast(message, 'info'),
    loading: (message: string) => showToast(message, 'loading'),
    update: updateToast,
    dismiss: dismissToast
  };

  return <ToastContext.Provider value={{ showToast, updateToast, dismissToast, toast }}>
    {children}
    <div className="pointer-events-none fixed inset-x-3 top-3 z-[100] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-5 sm:top-5 sm:w-full sm:max-w-sm" aria-label="Notifications">
      {toasts.map(item => {
        const error = item.type === 'error';
        const Icon = item.type === 'success' ? CheckCircle2 : error ? AlertCircle : item.type === 'warning' ? TriangleAlert : item.type === 'loading' ? Loader2 : Info;
        const style = item.type === 'success' ? 'border-emerald-200 bg-white text-emerald-900' : error ? 'border-rose-200 bg-white text-rose-900' : item.type === 'warning' ? 'border-amber-200 bg-white text-amber-900' : 'border-sky-200 bg-white text-slate-800';
        return <div
          key={item.id}
          role={error ? 'alert' : 'status'}
          aria-live={error ? 'assertive' : 'polite'}
          onMouseEnter={() => { const timer = timers.current.get(item.id); if (timer) clearTimeout(timer); }}
          onMouseLeave={() => schedule(item.id, item.type)}
          className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-3.5 shadow-xl ${style}`}
        >
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${item.type === 'loading' ? 'animate-spin' : ''}`} />
          <span className="min-w-0 flex-1 text-sm font-semibold leading-5">{item.message}</span>
          <button type="button" onClick={() => dismissToast(item.id)} aria-label="Dismiss notification" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </div>;
      })}
    </div>
  </ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
