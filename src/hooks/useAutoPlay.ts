import { useEffect, useCallback, useRef } from 'react';

export const useAutoPlay = (
  enabled: boolean,
  interval: number,
  onNext: () => void
) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onNextRef = useRef(onNext);

  // Keep onNext ref up to date
  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  const startAutoPlay = useCallback(() => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!enabled) {
      return;
    }

    // Use ref to avoid recreating interval when onNext changes
    timerRef.current = setInterval(() => {
      onNextRef.current();
    }, interval);
  }, [enabled, interval]);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      stopAutoPlay();
    };
  }, [enabled, startAutoPlay, stopAutoPlay]);

  return { startAutoPlay, stopAutoPlay };
};
