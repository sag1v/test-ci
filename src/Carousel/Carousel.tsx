import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import * as styles from './Carousel.css';
import { getItemsToRender } from '../utils/getItemsToRender';
import { getTrackPosition } from '../utils/getTrackPosition';
import { getResponsiveProps } from '../utils/getResponsiveProps';
import { CarouselResponsiveProps } from '../types';

export interface CarouselProps {
  children: React.ReactNode;
  infinite?: boolean;
  itemsToShow?: number;
  itemsToMove?: number;
  enableAutoPlay?: boolean;
  autoPlaySpeed?: number;
  initialActiveIndex?: number;
  onChange?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  isRTL?: boolean;
  responsive?: Record<number, CarouselResponsiveProps>;
}

interface CarouselState {
  currentIndex: number;
  trackOffset: number;
  isAnimating: boolean;
  direction: 'next' | 'prev' | null;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  responsive,
  ...defaultProps
}) => {
  // All hooks at the top
  const [state, setState] = useState<CarouselState>({
    currentIndex: defaultProps.initialActiveIndex || 0,
    trackOffset: 0,
    isAnimating: false,
    direction: null,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isRTL] = useState(defaultProps.isRTL || false);

  // Calculate these before hooks that depend on them
  const safeChildren = children || [];
  const totalItems = React.Children.count(safeChildren);
  const allItems = React.Children.toArray(safeChildren);

  const activeProps = useMemo(
    () => getResponsiveProps(defaultProps, responsive, containerWidth),
    [defaultProps, responsive, containerWidth]
  );

  const { itemsToShow = 1, itemsToMove = 1, infinite = false } = activeProps;

  const getDirectionalOffset = useCallback(
    (offset: number) => (isRTL ? -offset : offset),
    [isRTL]
  );

  const handleNext = useCallback(() => {
    if (state.isAnimating) {
      return;
    }
    if (
      !infinite &&
      (isRTL
        ? state.currentIndex === 0
        : state.currentIndex >= totalItems - itemsToShow)
    ) {
      return;
    }

    setState((prev) => ({
      ...prev,
      direction: 'next',
      isAnimating: true,
      trackOffset: getDirectionalOffset(-slideWidth * itemsToMove),
    }));
    defaultProps.onNext?.();
  }, [
    state.isAnimating,
    state.currentIndex,
    slideWidth,
    itemsToMove,
    infinite,
    totalItems,
    itemsToShow,
    defaultProps,
    getDirectionalOffset,
    isRTL,
  ]);

  const handlePrev = useCallback(() => {
    if (state.isAnimating) {
      return;
    }
    if (
      !infinite &&
      (isRTL
        ? state.currentIndex >= totalItems - itemsToShow
        : state.currentIndex === 0)
    ) {
      return;
    }

    setState((prev) => ({
      ...prev,
      direction: 'prev',
      isAnimating: true,
      trackOffset: getDirectionalOffset(slideWidth * itemsToMove),
    }));
    defaultProps.onPrev?.();
  }, [
    state.isAnimating,
    state.currentIndex,
    slideWidth,
    itemsToMove,
    infinite,
    totalItems,
    itemsToShow,
    defaultProps,
    getDirectionalOffset,
    isRTL,
  ]);

  // All other hooks
  useEffect(() => {
    if (!rootRef.current || !slideRef.current) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if (target.classList.contains(styles.root)) {
          setSlideWidth(entry.contentRect.width / itemsToShow);
          setContainerWidth(entry.contentRect.width);
        }
        if (target.classList.contains(styles.slide)) {
          const firstSlideContent = target.firstElementChild;
          if (firstSlideContent) {
            setSlideHeight(
              Math.ceil(firstSlideContent.getBoundingClientRect().height)
            );
          }
        }
      });
    });

    resizeObserver.observe(rootRef.current);
    resizeObserver.observe(slideRef.current);
    return () => resizeObserver.disconnect();
  }, [itemsToShow, containerWidth]);

  const itemsToRender = useMemo(() => {
    const itemsToRenderIndexes = getItemsToRender({
      currentIndex: state.currentIndex,
      totalItems,
      itemsToShow,
      itemsToMove,
      circular: infinite,
    });

    return itemsToRenderIndexes.map((index) => ({
      index,
      content: allItems[index],
    }));
  }, [
    state.currentIndex,
    totalItems,
    itemsToShow,
    itemsToMove,
    infinite,
    allItems,
  ]);

  const handleTransitionEnd = useCallback(() => {
    setState((prev) => {
      let newIndex;
      if (isRTL) {
        newIndex =
          prev.direction === 'next'
            ? (prev.currentIndex - itemsToMove + totalItems) % totalItems
            : (prev.currentIndex + itemsToMove) % totalItems;
      } else {
        newIndex =
          prev.direction === 'next'
            ? (prev.currentIndex + itemsToMove) % totalItems
            : (prev.currentIndex - itemsToMove + totalItems) % totalItems;
      }

      return {
        currentIndex: newIndex,
        trackOffset: 0,
        isAnimating: false,
        direction: null,
      };
    });
  }, [itemsToMove, totalItems, isRTL]);

  const trackPosition = getTrackPosition({
    currentIndex: state.currentIndex,
    totalItems,
    itemsToShow,
    itemsToMove,
    slideWidth,
    itemsToRenderCount: itemsToRender.length,
    circular: infinite,
    animationOffset: state.trackOffset,
    isRTL,
  });

  // Now do the validation check after all hooks
  if (!children) {
    console.warn('Carousel component requires children');
    return null;
  }

  return (
    <div ref={rootRef} className={styles.root} dir={isRTL ? 'rtl' : 'ltr'}>
      <button
        onClick={handlePrev}
        className={styles.prevArrow}
        disabled={
          !infinite &&
          (isRTL
            ? state.currentIndex >= totalItems - itemsToShow
            : state.currentIndex === 0)
        }
      >
        ←
      </button>

      <div
        className={styles.track}
        style={{
          transform: `translate3d(${trackPosition}px, 0, 0)`,
          transition: state.isAnimating ? 'transform 0.3s ease-in-out' : 'none',
          width: slideWidth
            ? `${slideWidth * (itemsToShow + 2 * itemsToMove)}px`
            : 'auto',
          height: slideHeight ? `${slideHeight}px` : 'auto',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {itemsToRender.map(({ index, content }, renderIndex) => (
          <div
            key={`slide-${index}-${renderIndex}`}
            ref={renderIndex === 0 ? slideRef : undefined}
            className={styles.slide}
            style={{
              width: `${slideWidth}px`,
            }}
          >
            {content}
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        className={styles.nextArrow}
        disabled={
          !infinite &&
          (isRTL
            ? state.currentIndex === 0
            : state.currentIndex >= totalItems - itemsToShow)
        }
      >
        →
      </button>
    </div>
  );
};
