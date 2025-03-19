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
import { useAutoPlay } from '../hooks/useAutoPlay';

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
  verticalMode?: boolean;
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
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [containerSize, setContainerSize] = useState(0);
  const [isRTL] = useState(defaultProps.isRTL || false);

  // Calculate these before hooks that depend on them
  const safeChildren = children || [];
  const totalItems = React.Children.count(safeChildren);
  const allItems = React.Children.toArray(safeChildren);

  const activeProps = useMemo(
    () => getResponsiveProps(defaultProps, responsive, containerSize),
    [defaultProps, responsive, containerSize]
  );

  // Extract props with responsive values
  const {
    infinite = false,
    itemsToShow = 1,
    itemsToMove = 1,
    enableAutoPlay = false,
    autoPlaySpeed = 3000,
    verticalMode = false,
  } = activeProps;

  // Extract callback props
  const { onNext, onPrev } = defaultProps;

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

  // Handle next button click
  const handleNext = useCallback(() => {
    if (state.isAnimating) {
      return;
    }

    if (onNext) {
      onNext();
    }

    // Set the track offset for smooth transition
    const offset = verticalMode ? -slideHeight : -slideWidth;

    setState((prevState) => ({
      ...prevState,
      trackOffset: offset * itemsToMove,
      isAnimating: true,
      direction: 'next',
    }));
  }, [
    state.isAnimating,
    onNext,
    itemsToMove,
    slideWidth,
    slideHeight,
    verticalMode,
  ]);

  // Handle previous button click
  const handlePrev = useCallback(() => {
    if (state.isAnimating) {
      return;
    }

    if (onPrev) {
      onPrev();
    }

    // Set the track offset for smooth transition
    const offset = verticalMode ? slideHeight : slideWidth;

    setState((prevState) => ({
      ...prevState,
      trackOffset: offset * itemsToMove,
      isAnimating: true,
      direction: 'prev',
    }));
  }, [
    state.isAnimating,
    onPrev,
    itemsToMove,
    slideWidth,
    slideHeight,
    verticalMode,
  ]);

  // Initialize autoplay
  const { startAutoPlay, stopAutoPlay } = useAutoPlay(
    enableAutoPlay,
    autoPlaySpeed,
    handleNext
  );

  // Add mouse event handlers to pause autoplay on hover
  const handleMouseEnter = useCallback(() => {
    if (enableAutoPlay) {
      stopAutoPlay();
    }
  }, [enableAutoPlay, stopAutoPlay]);

  const handleMouseLeave = useCallback(() => {
    if (enableAutoPlay) {
      startAutoPlay();
    }
  }, [enableAutoPlay, startAutoPlay]);

  // Effect for calculating sizes
  useEffect(() => {
    if (!rootRef.current || !frameRef.current) {
      return;
    }

    // One-time calculation of slide dimensions
    const calculateSizes = (entries?: ResizeObserverEntry[]) => {
      if (!frameRef.current || !rootRef.current) {
        return;
      }

      let rootRect: DOMRect | { width: number; height: number };
      let frameRect: DOMRect | { width: number; height: number };

      if (entries && entries.length > 0) {
        // Use entries from ResizeObserver if available
        const rootEntry = entries.find(
          (entry) => entry.target === rootRef.current
        );
        const frameEntry = entries.find(
          (entry) => entry.target === frameRef.current
        );

        if (rootEntry) {
          rootRect = {
            width: rootEntry.contentRect.width,
            height: rootEntry.contentRect.height,
          };
        } else {
          rootRect = rootRef.current.getBoundingClientRect();
        }

        if (frameEntry) {
          frameRect = {
            width: frameEntry.contentRect.width,
            height: frameEntry.contentRect.height,
          };
        } else {
          frameRect = frameRef.current.getBoundingClientRect();
        }
      } else {
        // Initial calculation - use getBoundingClientRect
        rootRect = rootRef.current.getBoundingClientRect();
        frameRect = frameRef.current.getBoundingClientRect();
      }

      // In vertical mode, track the root height instead of width for responsive features
      if (verticalMode) {
        setContainerSize(rootRect.height);
      } else {
        setContainerSize(rootRect.width);
      }

      // For horizontal mode, calculate slide width based on frame width and itemsToShow
      if (!verticalMode && frameRect.width > 0 && itemsToShow > 0) {
        const calculatedSlideWidth = Math.floor(frameRect.width / itemsToShow);
        setSlideWidth(calculatedSlideWidth > 0 ? calculatedSlideWidth : 0);
      }

      // For vertical mode, measure the track to determine slide height
      if (verticalMode && trackRef.current) {
        // Use itemsToRender.length for consistency with other parts of the code
        const renderedItemsCount = itemsToRender.length;

        if (renderedItemsCount === 0) {
          return; // No items to measure
        }

        // First, temporarily make the track visible with all items to measure
        const originalStyle = trackRef.current.style.cssText;

        // Remove transform and transition to get natural height
        trackRef.current.style.cssText =
          'position: absolute; transform: none; transition: none; visibility: visible; height: auto;';

        // Measure the track's natural height
        const trackRect = trackRef.current.getBoundingClientRect();
        const totalTrackHeight = trackRect.height;

        // Restore original style
        trackRef.current.style.cssText = originalStyle;

        if (totalTrackHeight > 0 && renderedItemsCount > 0) {
          // Calculate slide height by dividing track height by number of rendered items
          const calculatedSlideHeight = Math.ceil(
            totalTrackHeight / renderedItemsCount
          );

          // Set slide height
          setSlideHeight(calculatedSlideHeight);

          // Set frame height to show exactly itemsToShow slides
          if (frameRef.current && itemsToShow > 0) {
            frameRef.current.style.height = `${calculatedSlideHeight * itemsToShow}px`;
          }
        }
      }
    };

    // Initial calculation
    calculateSizes();

    // Set up ResizeObserver for width/height changes based on mode
    const resizeObserver = new ResizeObserver((entries) => {
      const rootEntry = entries.find(
        (entry) => entry.target === rootRef.current
      );
      const frameEntry = entries.find(
        (entry) => entry.target === frameRef.current
      );

      if (verticalMode) {
        // In vertical mode, recalculate if height changes
        if (
          rootEntry?.contentRect.height !== containerSize ||
          (frameEntry && frameEntry.contentRect.height > 0)
        ) {
          calculateSizes(entries);
        }
      } else {
        // In horizontal mode, recalculate if width changes
        if (
          rootEntry?.contentRect.width !== containerSize ||
          (frameEntry && frameEntry.contentRect.width > 0)
        ) {
          calculateSizes(entries);
        }
      }
    });

    resizeObserver.observe(rootRef.current);
    resizeObserver.observe(frameRef.current);

    // Clean up
    return () => {
      resizeObserver.disconnect();
    };
  }, [itemsToShow, verticalMode, containerSize, itemsToRender.length]);

  // Handle transition end event
  const handleTransitionEnd = useCallback(() => {
    if (!state.isAnimating) {
      return;
    }

    setState((prev) => {
      // Calculate the new index based on the direction of movement
      let newIndex = prev.currentIndex;

      if (prev.direction === 'next') {
        newIndex = isRTL
          ? Math.max(0, prev.currentIndex - itemsToMove)
          : Math.min(totalItems - itemsToShow, prev.currentIndex + itemsToMove);

        if (infinite) {
          newIndex = isRTL
            ? (prev.currentIndex - itemsToMove + totalItems) % totalItems
            : (prev.currentIndex + itemsToMove) % totalItems;
        }
      } else if (prev.direction === 'prev') {
        newIndex = isRTL
          ? Math.min(totalItems - itemsToShow, prev.currentIndex + itemsToMove)
          : Math.max(0, prev.currentIndex - itemsToMove);

        if (infinite) {
          newIndex = isRTL
            ? (prev.currentIndex + itemsToMove) % totalItems
            : (prev.currentIndex - itemsToMove + totalItems) % totalItems;
        }
      }

      // Call onChange callback with the new index
      if (defaultProps.onChange && newIndex !== prev.currentIndex) {
        defaultProps.onChange(newIndex);
      }

      return {
        currentIndex: newIndex,
        trackOffset: 0,
        isAnimating: false,
        direction: null,
      };
    });
  }, [
    itemsToMove,
    totalItems,
    isRTL,
    defaultProps,
    infinite,
    itemsToShow,
    state.isAnimating,
  ]);

  const trackPosition = getTrackPosition({
    currentIndex: state.currentIndex,
    totalItems,
    itemsToShow,
    itemsToMove,
    slideWidth,
    slideHeight,
    itemsToRenderCount: itemsToRender.length,
    circular: infinite,
    animationOffset: state.trackOffset,
    isRTL,
    isVertical: verticalMode,
  });

  // Initialize autoplay
  useEffect(() => {
    if (enableAutoPlay) {
      startAutoPlay();
    }
  }, [enableAutoPlay, startAutoPlay]);

  // Now do the validation check after all hooks
  if (!children) {
    console.warn('Carousel component requires children');
    return null;
  }

  const PrevButton = (
    <button
      onClick={handlePrev}
      className={styles.prevArrow}
      disabled={
        !infinite &&
        (isRTL
          ? state.currentIndex >= totalItems - itemsToShow
          : state.currentIndex <= 0)
      }
      aria-label={verticalMode ? 'Previous slide (up)' : 'Previous slide'}
    >
      {verticalMode ? '↑' : '←'}
    </button>
  );

  const NextButton = (
    <button
      onClick={handleNext}
      className={styles.nextArrow}
      disabled={
        !infinite &&
        (isRTL
          ? state.currentIndex <= 0
          : state.currentIndex >= totalItems - itemsToShow)
      }
      aria-label={verticalMode ? 'Next slide (down)' : 'Next slide'}
    >
      {verticalMode ? '↓' : '→'}
    </button>
  );

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        height: '100%', // Ensure root takes full height
      }}
    >
      {/* Previous button - always on the side */}
      {isRTL ? NextButton : PrevButton}

      {/* Frame container - wraps the track */}
      <div
        ref={frameRef}
        className={styles.frame}
        style={{
          // we set the max width to the width of the itemsToShow because eitherwise we will see a portion of the next item
          maxWidth: slideWidth > 0 ? `${slideWidth * itemsToShow}px` : '100%',
        }}
      >
        <div
          ref={trackRef}
          className={`${styles.track} ${verticalMode ? styles.trackVertical : ''}`}
          style={{
            direction: isRTL ? 'rtl' : 'ltr',
            transform: verticalMode
              ? `translateY(${trackPosition}px)`
              : `translateX(${trackPosition}px)`,
            transition: state.isAnimating
              ? 'transform 0.3s ease-in-out'
              : 'none',
            width: '100%',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {itemsToRender.map(({ index, content }, renderIndex) => {
            // Only apply fixed height in vertical mode if we have a valid calculated height
            const slideStyle = verticalMode
              ? slideHeight > 0
                ? { height: `${slideHeight}px` }
                : { flex: `1 0 ${100 / itemsToShow}%` } // Fallback to percentage-based height
              : { width: slideWidth > 0 ? `${slideWidth}px` : 'auto' };

            // we use index as key to ensure that the slide is not recreated when the index changes
            const key = `slide-${index}`;

            return (
              <div
                data-renderindex={renderIndex}
                data-key={key}
                key={key}
                className={`${styles.slide}`}
                style={slideStyle}
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next button - always on the side */}
      {isRTL ? PrevButton : NextButton}
    </div>
  );
};
