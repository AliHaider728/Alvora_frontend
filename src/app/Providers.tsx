'use client';

import React from 'react';
import { StoreProvider } from '../context/StoreContext';
import { ToastProvider } from '../context/ToastContext';
import { DialogProvider } from '../context/DialogContext';
import { AuthProvider } from '../context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <DialogProvider>
        <StoreProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </StoreProvider>
      </DialogProvider>
    </ToastProvider>
  );
}
