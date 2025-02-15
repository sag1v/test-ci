import { useCallback, useState } from 'react';

interface SwipeConfig {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  enabled: boolean;
  enableMouse: boolean;
  threshold?: number;
}

export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  enabled,
  enableMouse,
  threshold = 50,
}: SwipeConfig) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!enabled) {
        return;
      }
      if (e.type === 'mousedown' && !enableMouse) {
        return;
      }

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      setStartX(clientX);
      setIsSwiping(true);
    },
    [enabled, enableMouse]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!enabled || startX === null) {
        return;
      }
      if (e.type === 'mousemove' && !enableMouse) {
        return;
      }

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const diff = startX - clientX;

      if (isSwiping) {
        return;
      }

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
        setStartX(null);
        setIsSwiping(false);
      }
    },
    [
      enabled,
      enableMouse,
      onSwipeLeft,
      onSwipeRight,
      startX,
      threshold,
      isSwiping,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    setStartX(null);
    setIsSwiping(false);
  }, []);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
