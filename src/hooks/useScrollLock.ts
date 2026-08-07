import { useEffect } from 'react';

export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;

    const currentLocks = parseInt(document.body.dataset.scrollLocks || '0', 10);
    document.body.dataset.scrollLocks = String(currentLocks + 1);
    
    if (currentLocks === 0) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      const remainingLocks = Math.max(0, parseInt(document.body.dataset.scrollLocks || '1', 10) - 1);
      document.body.dataset.scrollLocks = String(remainingLocks);
      
      if (remainingLocks === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [isLocked]);
};
