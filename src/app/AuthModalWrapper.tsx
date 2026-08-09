'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';

export function AuthModalWrapper() {
  const { isAuthModalOpen, closeAuthModal, authModalMode } = useAuth();
  
  return (
    <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} defaultMode={authModalMode} />
  );
}
