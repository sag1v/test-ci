import { useEffect, useState, RefObject } from 'react';
import { BreakPoint } from '../types';

export const useResizeObserver = (
  ref: RefObject<HTMLElement>,
  breakPoints: BreakPoint[]
) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentBreakPoint, setCurrentBreakPoint] = useState<number>(0);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setContainerWidth(width);

      // Find matching breakpoint
      const matchingBreakPoint = breakPoints
        .sort((a, b) => b.width - a.width)
        .find((bp) => width >= bp.width);

      setCurrentBreakPoint(matchingBreakPoint?.width || 0);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, breakPoints]);

  return { containerWidth, currentBreakPoint };
};
