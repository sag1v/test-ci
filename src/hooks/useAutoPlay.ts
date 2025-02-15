import { useEffect, useCallback, useRef } from 'react';

export const useAutoPlay = (
  enabled: boolean,
  interval: number,
  onNext: () => void
) => {
  const timerRef = useRef<NodeJS.Timeout>();

  const startAutoPlay = useCallback(() => {
    if (!enabled) {
      return;
    }
    timerRef.current = setInterval(onNext, interval);
  }, [enabled, interval, onNext]);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startAutoPlay();
    }
    return stopAutoPlay;
  }, [enabled, startAutoPlay, stopAutoPlay]);

  return { startAutoPlay, stopAutoPlay };
};
