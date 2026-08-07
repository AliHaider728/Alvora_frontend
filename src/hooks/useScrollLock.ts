import { useEffect, useId } from 'react';

// Set-based lock ownership: each component instance acquires a unique lock.
// Body overflow is 'hidden' whenever at least one lock is held.
const activeLocks = new Set<string>();

function syncBodyOverflow() {
  document.body.style.overflow = activeLocks.size > 0 ? 'hidden' : '';
}

export const useScrollLock = (isLocked: boolean) => {
  const id = useId();

  useEffect(() => {
    if (!isLocked) {
      // If this component's lock was previously held but isLocked changed to false,
      // release it explicitly.
      if (activeLocks.has(id)) {
        activeLocks.delete(id);
        syncBodyOverflow();
      }
      return;
    }

    activeLocks.add(id);
    syncBodyOverflow();

    return () => {
      activeLocks.delete(id);
      syncBodyOverflow();
    };
  }, [isLocked, id]);

  // Cleanup on unmount regardless of isLocked state
  useEffect(() => {
    return () => {
      activeLocks.delete(id);
      syncBodyOverflow();
    };
  }, [id]);
};
