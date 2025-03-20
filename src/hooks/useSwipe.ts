import { useState, useCallback, useEffect } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeRelease?: (
    percentage: number,
    direction: 'left' | 'right' | 'up' | 'down' | null
  ) => void;
}

interface UseSwipeProps extends SwipeHandlers {
  element: React.RefObject<HTMLElement>;
  threshold?: number;
  preventDefault?: boolean;
  mouseSupport?: boolean;
}

interface SwipeState {
  startX: number;
  startY: number;
  isMouseDown: boolean;
  currentX: number;
  currentY: number;
}

export const useSwipe = ({
  element,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onSwipeRelease,
  threshold = 50,
  preventDefault = true,
  mouseSupport = true,
}: UseSwipeProps) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    isMouseDown: false,
    currentX: 0,
    currentY: 0,
  });

  const [releaseDirection, setReleaseDirection] = useState<
    'left' | 'right' | 'up' | 'down' | null
  >(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (preventDefault) {
        e.preventDefault();
      }

      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;

      setSwipeState({
        startX: touchX,
        startY: touchY,
        isMouseDown: false,
        currentX: touchX,
        currentY: touchY,
      });

      setReleaseDirection(null);
    },
    [preventDefault]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (preventDefault) {
        e.preventDefault();
      }

      setSwipeState((prev) => ({
        ...prev,
        currentX: e.touches[0].clientX,
        currentY: e.touches[0].clientY,
      }));
    },
    [preventDefault]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (preventDefault) {
        e.preventDefault();
      }

      const deltaX = e.changedTouches[0].clientX - swipeState.startX;
      const deltaY = e.changedTouches[0].clientY - swipeState.startY;

      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      const elementWidth = element.current?.clientWidth || threshold;
      const elementHeight = element.current?.clientHeight || threshold;
      const horizontalPercentage = Math.abs(deltaX) / elementWidth;
      const verticalPercentage = Math.abs(deltaY) / elementHeight;

      const hasSignificantMovement =
        Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5;

      let direction: 'left' | 'right' | 'up' | 'down' | null = null;
      let percentage = 0;

      if (isHorizontalSwipe) {
        direction = deltaX > 0 ? 'right' : 'left';
        percentage = horizontalPercentage;

        if (deltaX > threshold && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < -threshold && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
        percentage = verticalPercentage;

        if (deltaY > threshold && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < -threshold && onSwipeUp) {
          onSwipeUp();
        }
      }

      if (onSwipeRelease && hasSignificantMovement) {
        setTimeout(() => {
          onSwipeRelease(percentage, direction);
        }, 10);
      } else {
        if (onSwipeRelease) {
          setTimeout(() => {
            onSwipeRelease(0, null);
          }, 10);
        }
      }

      setSwipeState((prev) => ({
        ...prev,
        isMouseDown: false,
      }));
    },
    [
      swipeState.startX,
      swipeState.startY,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onSwipeRelease,
      threshold,
      element,
      preventDefault,
    ]
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setSwipeState({
      startX: e.clientX,
      startY: e.clientY,
      isMouseDown: true,
      currentX: e.clientX,
      currentY: e.clientY,
    });

    setReleaseDirection(null);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!swipeState.isMouseDown) {
        return;
      }

      if (preventDefault && swipeState.isMouseDown) {
        e.preventDefault();
      }

      setSwipeState((prev) => ({
        ...prev,
        currentX: e.clientX,
        currentY: e.clientY,
      }));
    },
    [preventDefault, swipeState.isMouseDown]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!swipeState.isMouseDown) {
        return;
      }

      const deltaX = e.clientX - swipeState.startX;
      const deltaY = e.clientY - swipeState.startY;

      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      const elementWidth = element.current?.clientWidth || threshold;
      const elementHeight = element.current?.clientHeight || threshold;
      const horizontalPercentage = Math.abs(deltaX) / elementWidth;
      const verticalPercentage = Math.abs(deltaY) / elementHeight;

      const hasSignificantMovement =
        Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5;

      let direction: 'left' | 'right' | 'up' | 'down' | null = null;
      let percentage = 0;

      if (isHorizontalSwipe) {
        direction = deltaX > 0 ? 'right' : 'left';
        percentage = horizontalPercentage;

        if (deltaX > threshold && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < -threshold && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
        percentage = verticalPercentage;

        if (deltaY > threshold && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < -threshold && onSwipeUp) {
          onSwipeUp();
        }
      }

      if (onSwipeRelease && hasSignificantMovement) {
        setTimeout(() => {
          onSwipeRelease(percentage, direction);
        }, 10);
      } else {
        if (onSwipeRelease) {
          setTimeout(() => {
            onSwipeRelease(0, null);
          }, 10);
        }
      }

      setSwipeState({
        startX: 0,
        startY: 0,
        isMouseDown: false,
        currentX: 0,
        currentY: 0,
      });
    },
    [
      swipeState.startX,
      swipeState.startY,
      swipeState.isMouseDown,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onSwipeRelease,
      threshold,
      element,
    ]
  );

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (!swipeState.isMouseDown) {
        return;
      }

      const deltaX = e.clientX - swipeState.startX;
      const deltaY = e.clientY - swipeState.startY;

      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      const elementWidth = element.current?.clientWidth || threshold;
      const elementHeight = element.current?.clientHeight || threshold;
      const horizontalPercentage = Math.abs(deltaX) / elementWidth;
      const verticalPercentage = Math.abs(deltaY) / elementHeight;

      let direction: 'left' | 'right' | 'up' | 'down' | null = null;
      let percentage = 0;

      if (isHorizontalSwipe) {
        direction = deltaX > 0 ? 'right' : 'left';
        percentage = horizontalPercentage;
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
        percentage = verticalPercentage;
      }

      setReleaseDirection(direction);

      if (onSwipeRelease) {
        setTimeout(() => {
          onSwipeRelease(percentage, direction);
        }, 10);
      }

      setSwipeState((prev) => ({
        ...prev,
        isMouseDown: false,
      }));
    },
    [swipeState, threshold, onSwipeRelease]
  );

  useEffect(() => {
    const currentElement = element.current;

    if (!currentElement) {
      return;
    }

    currentElement.addEventListener('touchstart', handleTouchStart, {
      passive: !preventDefault,
    });
    currentElement.addEventListener('touchmove', handleTouchMove, {
      passive: !preventDefault,
    });
    currentElement.addEventListener('touchend', handleTouchEnd);

    if (mouseSupport) {
      currentElement.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      currentElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      currentElement.removeEventListener('touchstart', handleTouchStart);
      currentElement.removeEventListener('touchmove', handleTouchMove);
      currentElement.removeEventListener('touchend', handleTouchEnd);

      if (mouseSupport) {
        currentElement.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        currentElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [
    element,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    mouseSupport,
    preventDefault,
  ]);

  const dragDistanceX = swipeState.currentX - swipeState.startX;
  const dragDistanceY = swipeState.currentY - swipeState.startY;

  return {
    isDragging: swipeState.isMouseDown,
    dragDistanceX,
    dragDistanceY,
    dragPercentageX: dragDistanceX / (element.current?.clientWidth || 1),
    dragPercentageY: dragDistanceY / (element.current?.clientHeight || 1),
    releaseDirection,
  };
};
