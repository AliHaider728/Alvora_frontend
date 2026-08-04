import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};
type PromptOptions = ConfirmOptions & { defaultValue?: string; inputLabel?: string; placeholder?: string };
type Request = (ConfirmOptions & { kind: 'confirm'; resolve: (value: boolean) => void }) |
  (PromptOptions & { kind: 'prompt'; resolve: (value: string | null) => void });

const DialogContext = createContext<{
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
} | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [request, setRequest] = useState<Request | null>(null);
  const [input, setInput] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const close = useCallback((value: boolean | string | null) => {
    if (!request) return;
    if (request.kind === 'confirm') request.resolve(Boolean(value));
    else request.resolve(typeof value === 'string' ? value : null);
    setRequest(null);
    setTimeout(() => previousFocus.current?.focus(), 0);
  }, [request]);

  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>(resolve => {
    previousFocus.current = document.activeElement as HTMLElement;
    setRequest({ ...options, kind: 'confirm', resolve });
  }), []);
  const prompt = useCallback((options: PromptOptions) => new Promise<string | null>(resolve => {
    previousFocus.current = document.activeElement as HTMLElement;
    setInput(options.defaultValue || '');
    setRequest({ ...options, kind: 'prompt', resolve });
  }), []);

  useEffect(() => {
    if (!request) return;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>('button,input,[href],[tabindex]:not([tabindex="-1"])');
    (request.kind === 'prompt' ? focusable?.[0] : focusable?.[focusable.length - 1])?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(request.kind === 'confirm' ? false : null); }
      if (event.key === 'Tab' && focusable?.length) {
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [request, close]);

  return <DialogContext.Provider value={{ confirm, prompt }}>
    {children}
    {request && createPortal(
      <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" onMouseDown={event => { if (event.target === event.currentTarget) close(request.kind === 'confirm' ? false : null); }}>
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="my-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
          <h2 id={titleId} className="font-heading text-lg font-black text-slate-900">{request.title}</h2>
          <p id={descriptionId} className="mt-2 text-sm leading-6 text-slate-600">{request.description}</p>
          {request.kind === 'prompt' && <label className="mt-4 block text-xs font-bold text-slate-700">{request.inputLabel || 'Value'}<input autoFocus value={input} onChange={event => setInput(event.target.value)} placeholder={request.placeholder} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" /></label>}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => close(request.kind === 'confirm' ? false : null)} className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700">{request.cancelLabel || 'Cancel'}</button>
            <button type="button" onClick={() => close(request.kind === 'prompt' ? input.trim() || null : true)} className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white ${request.destructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-900 hover:bg-slate-800'}`}>{request.confirmLabel || 'Confirm'}</button>
          </div>
        </div>
      </div>, document.body
    )}
  </DialogContext.Provider>;
};

export const useDialog = () => {
  const value = useContext(DialogContext);
  if (!value) throw new Error('useDialog must be used within a DialogProvider');
  return value;
};
