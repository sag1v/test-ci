import { CSSProperties } from 'react';

export interface BreakPoint {
  width: number;
  itemsToShow?: number;
  itemsToMove?: number;
}

export type CarouselResponsiveProps = Omit<
  CarouselProps,
  'children' | 'responsive'
>;

export interface CarouselProps {
  children: React.ReactNode;
  infinite?: boolean;
  lazyLoadSlides?: boolean;
  className?: string;
  style?: CSSProperties;
  verticalMode?: boolean;
  isRTL?: boolean;
  pagination?: boolean;
  showArrows?: boolean;
  disableArrowsOnEnd?: boolean;
  transitionMs?: number;
  easing?: string;
  enableTilt?: boolean;
  itemsToShow?: number;
  itemsToMove?: number;
  breakPoints?: BreakPoint[];
  initialActiveIndex?: number;
  enableSwipe?: boolean;
  enableMouseSwipe?: boolean;
  enableAutoPlay?: boolean;
  autoPlaySpeed?: number;
  renderArrow?: (type: 'prev' | 'next', onClick: () => void) => JSX.Element;
  renderPagination?: (
    pages: number,
    activePage: number,
    onClick: (index: number) => void
  ) => JSX.Element;
  onChange?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onNextStart?: (prevIndex: number, nextIndex: number) => void;
  onNextEnd?: (newIndex: number) => void;
  onPrevStart?: (prevIndex: number, nextIndex: number) => void;
  onPrevEnd?: (newIndex: number) => void;
  onResize?: (currentBreakPoint: number) => void;
  circular?: boolean;
  responsive?: Record<number, CarouselResponsiveProps>;
}

export interface CarouselState {
  currentIndex: number;
  totalItems: number;
}
