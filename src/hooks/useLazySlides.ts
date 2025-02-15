import { ReactNode, useMemo } from 'react';
import { Children } from 'react';

export const useLazySlides = (
  children: ReactNode,
  currentIndex: number,
  itemsToShow: number,
  lazyLoad: boolean
) => {
  return useMemo(() => {
    const childrenArray = Children.toArray(children);
    const totalSlides = childrenArray.length;

    if (!lazyLoad) {
      return { visibleSlides: childrenArray };
    }

    // Calculate which slides should be visible
    const start = Math.max(0, currentIndex - itemsToShow);
    const end = Math.min(totalSlides, currentIndex + itemsToShow * 2);

    const visibleSlides = childrenArray.slice(start, end);

    return { visibleSlides };
  }, [children, currentIndex, itemsToShow, lazyLoad]);
};
