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
import { useSwipe } from '../hooks/useSwipe';

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
  isAnimationAllowed: boolean;
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
    isAnimationAllowed: false,
    direction: null,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [containerSize, setContainerSize] = useState(0);
  const [isRTL] = useState(defaultProps.isRTL || false);

  // Add a cursor style variable to indicate when dragging is active
  const [isDragModeActive, setIsDragModeActive] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

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

  // Handle basic next slide action without swipe logic
  const handleNextBase = useCallback(() => {
    if (state.isAnimationAllowed) {
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
      isAnimationAllowed: true,
      direction: 'next',
    }));
  }, [
    state.isAnimationAllowed,
    onNext,
    itemsToMove,
    slideWidth,
    slideHeight,
    verticalMode,
  ]);

  // Handle basic prev slide action without swipe logic
  const handlePrevBase = useCallback(() => {
    if (state.isAnimationAllowed) {
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
      isAnimationAllowed: true,
      direction: 'prev',
    }));
  }, [
    state.isAnimationAllowed,
    onPrev,
    itemsToMove,
    slideWidth,
    slideHeight,
    verticalMode,
  ]);

  // External-facing handlers (used by buttons)
  const handleNext = useCallback(() => {
    handleNextBase();
  }, [handleNextBase]);

  const handlePrev = useCallback(() => {
    handlePrevBase();
  }, [handlePrevBase]);

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

  // Integrate swipe functionality with enhanced drag tracking
  const {
    isDragging: isUserDragging,
    dragDistanceX,
    dragDistanceY,
  } = useSwipe({
    element: frameRef,
    threshold: 50,
    mouseSupport: true,
    onSwipeRelease: (percentage, direction) => {
      // Simple threshold check - if we dragged more than 1/3 of the frame size
      const threshold = 1 / 4;

      // Check if we're at the edge in non-infinite mode
      const isAtLeftEdge =
        !infinite &&
        (isRTL
          ? state.currentIndex >= totalItems - itemsToShow
          : state.currentIndex <= 0);
      const isAtRightEdge =
        !infinite &&
        (isRTL
          ? state.currentIndex <= 0
          : state.currentIndex >= totalItems - itemsToShow);

      // Determine swipe direction based on carousel mode
      let nextSlide = false;
      let prevSlide = false;

      if (verticalMode) {
        // In vertical mode: up -> next, down -> prev
        nextSlide = direction === 'up';
        prevSlide = direction === 'down';
      } else if (isRTL) {
        // In RTL mode: left -> prev, right -> next
        nextSlide = direction === 'right';
        prevSlide = direction === 'left';
      } else {
        // In LTR mode: left -> next, right -> prev
        nextSlide = direction === 'left';
        prevSlide = direction === 'right';
      }

      // Only prevent movement past the edge, allow movement away from edge
      const isEdgeViolation =
        (isAtLeftEdge && prevSlide) || // At left edge trying to go previous
        (isAtRightEdge && nextSlide); // At right edge trying to go next

      // If swiping past edge or threshold not reached, return to current position
      if (isEdgeViolation || percentage < threshold) {
        // Return to current position with animation
        setState({
          ...state,
          trackOffset: 0,
          isAnimationAllowed: true,
          direction: null,
        });
      } else {
        // Not edge violation and threshold reached - execute the appropriate action
        if (nextSlide) {
          handleNextBase();
        } else if (prevSlide) {
          handlePrevBase();
        }
      }

      // Reset drag state to re-enable animations
      setIsDragModeActive(false);
      setDragOffset(0);
    },
  });

  // Handle real-time dragging
  useEffect(() => {
    // When drag starts, disable transitions by setting isDragModeActive
    if (isUserDragging && !isDragModeActive) {
      setIsDragModeActive(true);
      // Stop any ongoing animations
      if (state.isAnimationAllowed) {
        setState((prev) => ({
          ...prev,
          isAnimationAllowed: false,
        }));
      }
    }

    // If currently dragging, update position in real-time without animation
    if (isUserDragging) {
      const offset = verticalMode ? dragDistanceY : dragDistanceX;
      setDragOffset(isRTL && !verticalMode ? -offset : offset);
    }
  }, [
    isUserDragging,
    isDragModeActive,
    dragDistanceX,
    dragDistanceY,
    verticalMode,
    isRTL,
    state.isAnimationAllowed,
  ]);

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
    if (!state.isAnimationAllowed) {
      return;
    }

    // Ensure we reset animation state correctly
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
        isAnimationAllowed: false,
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
    state.isAnimationAllowed,
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

  // Calculate the effective track position with drag offset
  const effectiveTrackPosition = isDragModeActive
    ? trackPosition + dragOffset
    : trackPosition;

  // Apply animation class
  useEffect(() => {
    // Manually add animation class when isAnimationAllowed is true
    if (trackRef.current) {
      if (state.isAnimationAllowed) {
        trackRef.current.classList.add(styles.trackAnimating);
      } else {
        trackRef.current.classList.remove(styles.trackAnimating);
      }
    }
  }, [state.isAnimationAllowed]);

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
        className={`${styles.frame} ${isDragModeActive ? styles.dragging : ''}`}
        style={{
          // we set the max width to the width of the itemsToShow because eitherwise we will see a portion of the next item
          maxWidth: slideWidth > 0 ? `${slideWidth * itemsToShow}px` : '100%',
        }}
      >
        <div
          ref={trackRef}
          className={`${styles.track} ${verticalMode ? styles.trackVertical : ''} 
                    ${isDragModeActive ? styles.trackDragging : ''} 
                    ${state.isAnimationAllowed ? styles.trackAnimating : ''}`}
          style={{
            direction: isRTL ? 'rtl' : 'ltr',
            transform: verticalMode
              ? `translateY(${effectiveTrackPosition}px)`
              : `translateX(${effectiveTrackPosition}px)`,
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
