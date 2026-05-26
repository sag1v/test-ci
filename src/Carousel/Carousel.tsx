import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import * as styles from './Carousel.css';
import { getItemsToRender } from '../utils/getItemsToRender';
import {
  getTrackPosition,
  calculateBaseOffset,
} from '../utils/getTrackPosition';
import { getResponsiveProps } from '../utils/getResponsiveProps';
import { CarouselResponsiveProps } from '../types';
import { useAutoPlay } from '../hooks/useAutoPlay';
import { useSwipe } from '../hooks/useSwipe';

export interface CarouselProps {
  children: React.ReactNode;
  infinite?: boolean;
  itemsToShow?: number;
  itemsToMove?: number;
  peekSize?: number;
  enableAutoPlay?: boolean;
  autoPlaySpeed?: number;
  initialActiveIndex?: number;
  onChange?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  isRTL?: boolean;
  responsive?: Record<number, CarouselResponsiveProps>;
  verticalMode?: boolean;
  freeMode?: boolean;
  freeSnapMode?: boolean;
}

interface CarouselState {
  currentIndex: number;
  trackOffset: number;
  isAnimationAllowed: boolean;
  direction: 'next' | 'prev' | null;
  targetIndex?: number; // The index we're animating to
  freeModeOffset?: number; // Offset for free mode (allows stopping at any position)
  isSnapping?: boolean; // Whether we're in a snap animation (faster transition)
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
    freeModeOffset: 0,
    isSnapping: false,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
    peekSize = 0,
    enableAutoPlay = false,
    autoPlaySpeed = 3000,
    verticalMode = false,
    freeMode = false,
    freeSnapMode = false,
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
      peekSize,
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
    peekSize,
  ]);

  // Handle basic next slide action without swipe logic
  const handleNextBase = useCallback(() => {
    if (state.isAnimationAllowed) {
      return;
    }

    if (onNext) {
      onNext();
    }

    // Calculate the animation offset
    const slideSize = verticalMode ? slideHeight : slideWidth;
    let animationOffset: number;
    let targetIndex: number;

    if (infinite) {
      // In infinite/circular mode, always move by a fixed amount
      // In RTL mode, reverse the direction (next moves right instead of left)
      animationOffset =
        isRTL && !verticalMode
          ? slideSize * itemsToMove
          : -slideSize * itemsToMove;
      targetIndex = (state.currentIndex + itemsToMove) % totalItems;
    } else {
      // In non-infinite mode, calculate based on position difference
      // Current base offset (where we are now)
      const currentBaseOffset = calculateBaseOffset({
        index: state.currentIndex,
        totalItems,
        itemsToShow,
        slideSize,
        itemsToMove,
        circular: false,
        peekSize,
      });

      // Calculate target index
      targetIndex = Math.min(
        state.currentIndex + itemsToMove,
        totalItems - itemsToShow
      );

      // Target base offset (where we want to be after animation)
      const targetBaseOffset = calculateBaseOffset({
        index: targetIndex,
        totalItems,
        itemsToShow,
        slideSize,
        itemsToMove,
        circular: false,
        peekSize,
      });

      // Animation offset is the difference
      // In RTL mode, since getTrackPosition negates the base position, we need to reverse the offset
      // Final position = -(baseOffset + renderOffset) + animationOffset
      // So if baseOffset changes from currentBaseOffset to targetBaseOffset:
      // In LTR: animationOffset = targetBaseOffset - currentBaseOffset
      // In RTL: animationOffset = -(targetBaseOffset - currentBaseOffset) = currentBaseOffset - targetBaseOffset
      animationOffset =
        isRTL && !verticalMode
          ? currentBaseOffset - targetBaseOffset
          : targetBaseOffset - currentBaseOffset;
    }

    // If no animation is needed (offset is 0 or already at target), update index immediately
    if (Math.abs(animationOffset) < 1 || targetIndex === state.currentIndex) {
      setState((prevState) => ({
        ...prevState,
        currentIndex: targetIndex,
        trackOffset: 0,
        isAnimationAllowed: false,
        direction: null,
        freeModeOffset: 0, // Reset free mode offset when using navigation buttons
      }));

      // Call onChange callback
      if (defaultProps.onChange && targetIndex !== state.currentIndex) {
        defaultProps.onChange(targetIndex);
      }
      return;
    }

    setState((prevState) => ({
      ...prevState,
      trackOffset: animationOffset,
      isAnimationAllowed: true,
      direction: 'next',
      targetIndex,
      freeModeOffset: 0, // Reset free mode offset when using navigation buttons
    }));

    // Clear any existing fallback timeout
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
    }

    // Fallback timeout in case transitionend doesn't fire
    fallbackTimeoutRef.current = setTimeout(() => {
      fallbackTimeoutRef.current = null;
      setState((prev) => {
        // Only reset if animation is still marked as allowed
        if (prev.isAnimationAllowed && prev.direction === 'next') {
          return {
            ...prev,
            currentIndex: targetIndex,
            trackOffset: 0,
            isAnimationAllowed: false,
            direction: null,
            targetIndex: undefined,
          };
        }
        return prev;
      });
    }, 600); // Slightly longer than animation duration (400ms)
  }, [
    state.isAnimationAllowed,
    state.currentIndex,
    onNext,
    itemsToMove,
    itemsToShow,
    totalItems,
    infinite,
    peekSize,
    slideWidth,
    slideHeight,
    verticalMode,
    isRTL,
    defaultProps,
  ]);

  // Handle basic prev slide action without swipe logic
  const handlePrevBase = useCallback(() => {
    if (state.isAnimationAllowed) {
      return;
    }

    if (onPrev) {
      onPrev();
    }

    // Calculate the animation offset
    const slideSize = verticalMode ? slideHeight : slideWidth;
    let animationOffset: number;
    let targetIndex: number;

    if (infinite) {
      // In infinite/circular mode, always move by a fixed amount
      // In RTL mode, reverse the direction (prev moves left instead of right)
      animationOffset =
        isRTL && !verticalMode
          ? -slideSize * itemsToMove
          : slideSize * itemsToMove;
      targetIndex =
        (state.currentIndex - (itemsToMove % totalItems) + totalItems) %
        totalItems;
    } else {
      // In non-infinite mode, calculate based on position difference
      // Current base offset (where we are now)
      const currentBaseOffset = calculateBaseOffset({
        index: state.currentIndex,
        totalItems,
        itemsToShow,
        slideSize,
        itemsToMove,
        circular: false,
        peekSize,
      });

      // Calculate target index
      targetIndex = Math.max(state.currentIndex - itemsToMove, 0);

      // Target base offset (where we want to be after animation)
      const targetBaseOffset = calculateBaseOffset({
        index: targetIndex,
        totalItems,
        itemsToShow,
        slideSize,
        itemsToMove,
        circular: false,
        peekSize,
      });

      // Animation offset is the difference
      // In RTL mode, since getTrackPosition negates the base position, we need to reverse the offset
      // Final position = -(baseOffset + renderOffset) + animationOffset
      // So if baseOffset changes from currentBaseOffset to targetBaseOffset:
      // In LTR: animationOffset = targetBaseOffset - currentBaseOffset
      // In RTL: animationOffset = -(targetBaseOffset - currentBaseOffset) = currentBaseOffset - targetBaseOffset
      animationOffset =
        isRTL && !verticalMode
          ? currentBaseOffset - targetBaseOffset
          : targetBaseOffset - currentBaseOffset;
    }

    // If no animation is needed (offset is 0 or already at target), update index immediately
    if (Math.abs(animationOffset) < 1 || targetIndex === state.currentIndex) {
      setState((prevState) => ({
        ...prevState,
        currentIndex: targetIndex,
        trackOffset: 0,
        isAnimationAllowed: false,
        direction: null,
        freeModeOffset: 0, // Reset free mode offset when using navigation buttons
      }));

      // Call onChange callback
      if (defaultProps.onChange && targetIndex !== state.currentIndex) {
        defaultProps.onChange(targetIndex);
      }
      return;
    }

    setState((prevState) => ({
      ...prevState,
      trackOffset: animationOffset,
      isAnimationAllowed: true,
      direction: 'prev',
      targetIndex,
      freeModeOffset: 0, // Reset free mode offset when using navigation buttons
    }));

    // Clear any existing fallback timeout
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
    }

    // Fallback timeout in case transitionend doesn't fire
    fallbackTimeoutRef.current = setTimeout(() => {
      fallbackTimeoutRef.current = null;
      setState((prev) => {
        // Only reset if animation is still marked as allowed
        if (prev.isAnimationAllowed && prev.direction === 'prev') {
          return {
            ...prev,
            currentIndex: targetIndex,
            trackOffset: 0,
            isAnimationAllowed: false,
            direction: null,
            targetIndex: undefined,
          };
        }
        return prev;
      });
    }, 600); // Slightly longer than animation duration (400ms)
  }, [
    state.isAnimationAllowed,
    state.currentIndex,
    onPrev,
    itemsToMove,
    itemsToShow,
    totalItems,
    infinite,
    peekSize,
    slideWidth,
    slideHeight,
    verticalMode,
    isRTL,
    defaultProps,
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

  // Helper function to apply rubberband effect when dragging past boundaries
  const applyRubberband = useCallback(
    (distance: number, currentOffset: number): number => {
      if (infinite) {
        return distance; // No rubberband in infinite mode
      }

      const slideSize = verticalMode ? slideHeight : slideWidth;
      if (slideSize <= 0) {
        return distance;
      }

      const basePosition = getTrackPosition({
        currentIndex: state.currentIndex,
        totalItems,
        itemsToShow,
        slideWidth,
        slideHeight,
        itemsToMove,
        circular: infinite,
        animationOffset: 0,
        isRTL,
        isVertical: verticalMode,
        peekSize,
      });

      const minIndex = 0;
      const maxIndex = totalItems - itemsToShow;

      const minPosition = getTrackPosition({
        currentIndex: minIndex,
        totalItems,
        itemsToShow,
        slideWidth,
        slideHeight,
        itemsToMove,
        circular: infinite,
        animationOffset: 0,
        isRTL,
        isVertical: verticalMode,
        peekSize,
      });

      const maxPosition = getTrackPosition({
        currentIndex: maxIndex,
        totalItems,
        itemsToShow,
        slideWidth,
        slideHeight,
        itemsToMove,
        circular: infinite,
        animationOffset: 0,
        isRTL,
        isVertical: verticalMode,
        peekSize,
      });

      const currentPosition = basePosition + currentOffset;
      const newPosition = currentPosition + distance;

      // Check if we're going past boundaries
      if (newPosition < minPosition) {
        const overflow = (newPosition - minPosition) / slideSize;
        const breakFactor = 2; // Rubberband tightness factor
        const frameSize = verticalMode
          ? frameRef.current?.clientHeight || window.innerHeight
          : frameRef.current?.clientWidth || window.innerWidth;
        const overflowedSize = Math.abs(overflow * slideSize);
        const resistance = Math.max(
          0,
          1 - (overflowedSize / frameSize) * breakFactor
        );
        return distance * resistance * resistance; // Squared for tighter effect
      }

      if (newPosition > maxPosition) {
        const overflow = (newPosition - maxPosition) / slideSize;
        const breakFactor = 2; // Rubberband tightness factor
        const frameSize = verticalMode
          ? frameRef.current?.clientHeight || window.innerHeight
          : frameRef.current?.clientWidth || window.innerWidth;
        const overflowedSize = Math.abs(overflow * slideSize);
        const resistance = Math.max(
          0,
          1 - (overflowedSize / frameSize) * breakFactor
        );
        return distance * resistance * resistance; // Squared for tighter effect
      }

      return distance;
    },
    [
      infinite,
      verticalMode,
      slideHeight,
      slideWidth,
      state.currentIndex,
      totalItems,
      itemsToShow,
      itemsToMove,
      isRTL,
      peekSize,
    ]
  );

  // Helper function to calculate position bounds for free mode
  const calculateFreeModeBounds = useCallback(
    (currentOffset: number): { offset: number; isAtBoundary: boolean } => {
      const slideSize = verticalMode ? slideHeight : slideWidth;
      if (slideSize <= 0) {
        return { offset: currentOffset, isAtBoundary: false };
      }

      if (!infinite) {
        // Calculate bounds based on current index
        const basePosition = getTrackPosition({
          currentIndex: state.currentIndex,
          totalItems,
          itemsToShow,
          slideWidth,
          slideHeight,
          itemsToMove,
          circular: infinite,
          animationOffset: 0,
          isRTL,
          isVertical: verticalMode,
          peekSize,
        });

        // Calculate min and max positions
        const minIndex = 0;
        const maxIndex = totalItems - itemsToShow;

        const minPosition = getTrackPosition({
          currentIndex: minIndex,
          totalItems,
          itemsToShow,
          slideWidth,
          slideHeight,
          itemsToMove,
          circular: infinite,
          animationOffset: 0,
          isRTL,
          isVertical: verticalMode,
          peekSize,
        });

        const maxPosition = getTrackPosition({
          currentIndex: maxIndex,
          totalItems,
          itemsToShow,
          slideWidth,
          slideHeight,
          itemsToMove,
          circular: infinite,
          animationOffset: 0,
          isRTL,
          isVertical: verticalMode,
          peekSize,
        });

        // Apply bounds
        const currentPosition = basePosition + currentOffset;
        const boundedPosition = Math.max(
          maxPosition,
          Math.min(minPosition, currentPosition)
        );
        const isAtBoundary = Math.abs(currentPosition - boundedPosition) > 0.1;
        return { offset: boundedPosition - basePosition, isAtBoundary };
      }

      // In infinite mode, allow free movement
      return { offset: currentOffset, isAtBoundary: false };
    },
    [
      verticalMode,
      slideHeight,
      slideWidth,
      infinite,
      state.currentIndex,
      totalItems,
      itemsToShow,
      itemsToMove,
      isRTL,
      peekSize,
    ]
  );

  // Momentum animation ref
  const momentumAnimationRef = useRef<number | null>(null);

  // Momentum animation function
  const startMomentumAnimation = useCallback(
    (
      initialVelocityX: number,
      initialVelocityY: number,
      initialOffset: number
    ) => {
      // Cancel any existing momentum animation
      if (momentumAnimationRef.current !== null) {
        cancelAnimationFrame(momentumAnimationRef.current);
      }

      const baseFriction = 0.95; // Normal deceleration factor (0.95 = 5% loss per frame)
      const boundaryFriction = 0.88; // Tighter friction when at boundaries (0.88 = 12% loss per frame)
      const snapFriction = 0.92; // Friction when snapping is needed (0.92 = 8% loss per frame)
      const minVelocity = 0.01; // Minimum velocity to continue animation
      let velocityX = initialVelocityX;
      let velocityY = initialVelocityY;
      let currentOffset = initialOffset;
      let lastFrameTime = performance.now();

      const animate = (currentTime: number) => {
        const deltaTime = Math.min((currentTime - lastFrameTime) / 16.67, 2); // Cap at 2x normal frame time
        lastFrameTime = currentTime;

        // Apply velocity (convert from px/ms to px/frame)
        const deltaX = velocityX * deltaTime * 16.67;
        const deltaY = velocityY * deltaTime * 16.67;
        const delta = verticalMode ? deltaY : deltaX;
        const adjustedDelta = isRTL && !verticalMode ? -delta : delta;

        // Apply rubberband effect for boundaries
        const rubberbandDelta = applyRubberband(adjustedDelta, currentOffset);
        currentOffset += rubberbandDelta;

        // Apply bounds and check if we're at boundary
        const { offset: boundedOffset, isAtBoundary } =
          calculateFreeModeBounds(currentOffset);

        // Determine friction based on context
        let friction = baseFriction;
        if (isAtBoundary) {
          friction = boundaryFriction; // Tighter friction at boundaries
        } else if (freeSnapMode) {
          friction = snapFriction; // Tighter friction when snapping is needed
        }

        // If we hit a boundary hard, reduce velocity more aggressively
        if (isAtBoundary && Math.abs(adjustedDelta) > 0.1) {
          velocityX *= friction * 0.9; // Extra reduction
          velocityY *= friction * 0.9;
        }

        currentOffset = boundedOffset;

        // Apply friction (deceleration)
        velocityX *= friction;
        velocityY *= friction;

        // Update state
        setState((prev) => ({
          ...prev,
          freeModeOffset: currentOffset,
          trackOffset: 0,
          isAnimationAllowed: false,
          direction: null,
        }));

        // Continue animation if velocity is significant
        if (
          Math.abs(velocityX) > minVelocity ||
          Math.abs(velocityY) > minVelocity
        ) {
          momentumAnimationRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete
          momentumAnimationRef.current = null;

          if (freeSnapMode) {
            // Snap to nearest slide
            setState((prev) => {
              const slideSize = verticalMode ? slideHeight : slideWidth;
              const currentBasePosition = getTrackPosition({
                currentIndex: prev.currentIndex,
                totalItems,
                itemsToShow,
                slideWidth,
                slideHeight,
                itemsToMove,
                circular: infinite,
                animationOffset: 0,
                isRTL,
                isVertical: verticalMode,
                peekSize,
              });

              const currentActualPosition = currentBasePosition + currentOffset;

              let nearestIndex = prev.currentIndex;
              if (slideSize > 0) {
                const basePosition = getTrackPosition({
                  currentIndex: 0,
                  totalItems,
                  itemsToShow,
                  slideWidth,
                  slideHeight,
                  itemsToMove,
                  circular: infinite,
                  animationOffset: 0,
                  isRTL,
                  isVertical: verticalMode,
                  peekSize,
                });

                const slidesFromStart =
                  (currentActualPosition - basePosition) / slideSize;
                const adjustedSlidesFromStart =
                  isRTL && !verticalMode ? -slidesFromStart : slidesFromStart;

                nearestIndex = Math.round(adjustedSlidesFromStart);

                if (!infinite) {
                  nearestIndex = Math.max(
                    0,
                    Math.min(nearestIndex, totalItems - itemsToShow)
                  );
                } else {
                  nearestIndex =
                    ((nearestIndex % totalItems) + totalItems) % totalItems;
                }
              }

              const targetPosition = getTrackPosition({
                currentIndex: nearestIndex,
                totalItems,
                itemsToShow,
                slideWidth,
                slideHeight,
                itemsToMove,
                circular: infinite,
                animationOffset: 0,
                isRTL,
                isVertical: verticalMode,
                peekSize,
              });

              const animationOffset = targetPosition - currentBasePosition;

              if (defaultProps.onChange && nearestIndex !== prev.currentIndex) {
                defaultProps.onChange(nearestIndex);
              }

              return {
                ...prev,
                currentIndex: nearestIndex,
                freeModeOffset: 0,
                trackOffset: animationOffset,
                isAnimationAllowed: true,
                direction: nearestIndex > prev.currentIndex ? 'next' : 'prev',
                targetIndex: nearestIndex,
                isSnapping: true, // Mark as snapping for faster animation
              };
            });
          }
        }
      };

      momentumAnimationRef.current = requestAnimationFrame(animate);
    },
    [
      verticalMode,
      isRTL,
      calculateFreeModeBounds,
      applyRubberband,
      freeSnapMode,
      infinite,
      totalItems,
      itemsToShow,
      itemsToMove,
      slideWidth,
      slideHeight,
      peekSize,
      defaultProps,
    ]
  );

  // Cleanup momentum animation on unmount
  useEffect(() => {
    return () => {
      if (momentumAnimationRef.current !== null) {
        cancelAnimationFrame(momentumAnimationRef.current);
      }
    };
  }, []);

  // Integrate swipe functionality with enhanced drag tracking
  const {
    isDragging: isUserDragging,
    dragDistanceX,
    dragDistanceY,
    getVelocity,
  } = useSwipe({
    element: frameRef,
    threshold: 50,
    mouseSupport: true,
    onSwipeRelease: (percentage, direction) => {
      // Handle free mode and free snap mode
      if (freeMode || freeSnapMode) {
        const currentDragOffset = verticalMode ? dragDistanceY : dragDistanceX;
        const adjustedDragOffset =
          isRTL && !verticalMode ? -currentDragOffset : currentDragOffset;

        // Get velocity for momentum
        const velocity = getVelocity();
        const velocityX = velocity.velocityX;
        const velocityY = velocity.velocityY;

        // Calculate final position including current drag
        const finalOffset = (state.freeModeOffset || 0) + adjustedDragOffset;

        // Only start momentum if velocity is significant
        const minVelocityThreshold = 0.1; // pixels per millisecond
        const hasSignificantVelocity =
          Math.abs(velocityX) > minVelocityThreshold ||
          Math.abs(velocityY) > minVelocityThreshold;

        if (hasSignificantVelocity) {
          // Start momentum animation with current offset
          startMomentumAnimation(velocityX, velocityY, finalOffset);
        } else {
          // No significant velocity - just apply final position
          const { offset: boundedOffset } =
            calculateFreeModeBounds(finalOffset);

          if (freeMode) {
            // Free mode: keep the current position
            setState({
              ...state,
              freeModeOffset: boundedOffset,
              trackOffset: 0,
              isAnimationAllowed: false,
              direction: null,
            });
          } else if (freeSnapMode) {
            // Free snap mode: snap to nearest slide immediately with faster animation
            const slideSize = verticalMode ? slideHeight : slideWidth;
            const currentBasePosition = getTrackPosition({
              currentIndex: state.currentIndex,
              totalItems,
              itemsToShow,
              slideWidth,
              slideHeight,
              itemsToMove,
              circular: infinite,
              animationOffset: 0,
              isRTL,
              isVertical: verticalMode,
              peekSize,
            });

            const currentActualPosition = currentBasePosition + boundedOffset;
            let nearestIndex = state.currentIndex;

            if (slideSize > 0) {
              const basePosition = getTrackPosition({
                currentIndex: 0,
                totalItems,
                itemsToShow,
                slideWidth,
                slideHeight,
                itemsToMove,
                circular: infinite,
                animationOffset: 0,
                isRTL,
                isVertical: verticalMode,
                peekSize,
              });

              const slidesFromStart =
                (currentActualPosition - basePosition) / slideSize;
              const adjustedSlidesFromStart =
                isRTL && !verticalMode ? -slidesFromStart : slidesFromStart;

              nearestIndex = Math.round(adjustedSlidesFromStart);

              if (!infinite) {
                nearestIndex = Math.max(
                  0,
                  Math.min(nearestIndex, totalItems - itemsToShow)
                );
              } else {
                nearestIndex =
                  ((nearestIndex % totalItems) + totalItems) % totalItems;
              }
            }

            const targetPosition = getTrackPosition({
              currentIndex: nearestIndex,
              totalItems,
              itemsToShow,
              slideWidth,
              slideHeight,
              itemsToMove,
              circular: infinite,
              animationOffset: 0,
              isRTL,
              isVertical: verticalMode,
              peekSize,
            });

            const animationOffset = targetPosition - currentBasePosition;

            setState({
              ...state,
              currentIndex: nearestIndex,
              freeModeOffset: 0,
              trackOffset: animationOffset,
              isAnimationAllowed: true,
              direction: nearestIndex > state.currentIndex ? 'next' : 'prev',
              targetIndex: nearestIndex,
              isSnapping: true, // Mark as snapping for faster animation
            });

            if (defaultProps.onChange && nearestIndex !== state.currentIndex) {
              defaultProps.onChange(nearestIndex);
            }
          }
        }

        // Reset drag state
        setIsDragModeActive(false);
        setDragOffset(0);
        return;
      }

      // Original snap-to-slide behavior (default mode)
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

  // Handle real-time dragging with rubberband effect
  useEffect(() => {
    // When drag starts, disable transitions by setting isDragModeActive
    if (isUserDragging && !isDragModeActive) {
      setIsDragModeActive(true);
      // Stop any ongoing animations
      if (state.isAnimationAllowed) {
        setState((prev) => ({
          ...prev,
          isAnimationAllowed: false,
          isSnapping: false,
        }));
      }
      // Cancel momentum animation if running
      if (momentumAnimationRef.current !== null) {
        cancelAnimationFrame(momentumAnimationRef.current);
        momentumAnimationRef.current = null;
      }
    }

    // If currently dragging, update position in real-time without animation
    if (isUserDragging && (freeMode || freeSnapMode)) {
      const offset = verticalMode ? dragDistanceY : dragDistanceX;
      const adjustedOffset = isRTL && !verticalMode ? -offset : offset;

      // Apply rubberband effect during dragging (apply to the delta, not total)
      const rubberbandDelta = applyRubberband(
        adjustedOffset,
        state.freeModeOffset || 0
      );

      // Use the rubberband-adjusted delta
      setDragOffset(rubberbandDelta);
    } else if (isUserDragging) {
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
    state.freeModeOffset,
    freeMode,
    freeSnapMode,
    applyRubberband,
    calculateFreeModeBounds,
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
        // When peekSize is set, total visible = itemsToShow + peekSize
        // (peekSize/2 on left + itemsToShow + peekSize/2 on right = itemsToShow + peekSize)
        const effectiveItemsToShow =
          peekSize > 0 ? itemsToShow + peekSize : itemsToShow;

        // We need to floor the width to avoid fractional pixels
        const newSlideWidth = Math.floor(
          frameRect.width / effectiveItemsToShow
        );

        // Only update slide width if it has changed significantly to prevent loops
        if (Math.abs(newSlideWidth - slideWidth) > 1) {
          setSlideWidth(newSlideWidth > 0 ? newSlideWidth : 0);
        }
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
  }, [
    itemsToShow,
    verticalMode,
    containerSize,
    itemsToRender.length,
    peekSize,
    slideWidth,
  ]);

  // Handle transition end event
  const handleTransitionEnd = useCallback(
    (e?: React.TransitionEvent) => {
      // Only handle transform transitions to avoid duplicate calls
      // Note: propertyName might be undefined in some cases, so we allow that through
      if (e && e.propertyName && e.propertyName !== 'transform') {
        return;
      }

      if (!state.isAnimationAllowed) {
        return;
      }

      // Clear the fallback timeout since transitionend fired
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }

      // Ensure we reset animation state correctly
      setState((prev) => {
        // Double-check animation is still allowed (prevent double-firing)
        if (!prev.isAnimationAllowed) {
          return prev;
        }

        // Use the targetIndex that was calculated when the animation started
        const newIndex = prev.targetIndex ?? prev.currentIndex;

        // Call onChange callback with the new index
        if (defaultProps.onChange && newIndex !== prev.currentIndex) {
          defaultProps.onChange(newIndex);
        }

        return {
          currentIndex: newIndex,
          trackOffset: 0,
          isAnimationAllowed: false,
          direction: null,
          targetIndex: undefined,
          freeModeOffset: 0, // Reset free mode offset after animation completes
          isSnapping: false, // Reset snapping flag
        };
      });
    },
    [defaultProps, state.isAnimationAllowed]
  );

  const trackPosition = getTrackPosition({
    currentIndex: state.currentIndex,
    totalItems,
    itemsToShow,
    itemsToMove,
    slideWidth,
    slideHeight,
    circular: infinite,
    animationOffset: state.trackOffset,
    isRTL,
    isVertical: verticalMode,
    peekSize,
  });

  // Calculate frame width
  // Frame shows: peekSize/2 on left + itemsToShow + peekSize/2 on right = itemsToShow + peekSize
  const frameMaxWidth = useMemo(() => {
    if (slideWidth <= 0) {
      return '100%';
    }

    const frameWidthInSlides =
      peekSize > 0 ? itemsToShow + peekSize : itemsToShow;
    return `${slideWidth * frameWidthInSlides}px`;
  }, [slideWidth, itemsToShow, peekSize]);

  // Calculate the effective track position with drag offset and free mode offset
  const effectiveTrackPosition = useMemo(() => {
    let position = trackPosition;

    // Add free mode offset if active (when not dragging, not animating)
    if (
      (freeMode || freeSnapMode) &&
      !state.isAnimationAllowed &&
      !isDragModeActive
    ) {
      position += state.freeModeOffset || 0;
    }

    // Add current drag offset during dragging
    // In free mode, add to base position + freeModeOffset
    if (isDragModeActive) {
      if (freeMode || freeSnapMode) {
        // In free mode, drag offset is relative to the current free mode position
        position += (state.freeModeOffset || 0) + dragOffset;
      } else {
        // In normal mode, drag offset is relative to the base position
        position += dragOffset;
      }
    }

    return position;
  }, [
    trackPosition,
    freeMode,
    freeSnapMode,
    state.isAnimationAllowed,
    state.freeModeOffset,
    isDragModeActive,
    dragOffset,
  ]);

  // Apply animation class
  useEffect(() => {
    // Manually add animation class when isAnimationAllowed is true
    if (trackRef.current) {
      if (state.isAnimationAllowed) {
        if (state.isSnapping) {
          trackRef.current.classList.add(styles.trackSnapping);
          trackRef.current.classList.remove(styles.trackAnimating);
        } else {
          trackRef.current.classList.add(styles.trackAnimating);
          trackRef.current.classList.remove(styles.trackSnapping);
        }
      } else {
        trackRef.current.classList.remove(styles.trackAnimating);
        trackRef.current.classList.remove(styles.trackSnapping);
      }
    }
  }, [state.isAnimationAllowed, state.isSnapping]);

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
        !infinite && (isRTL ? state.currentIndex <= 0 : state.currentIndex <= 0)
      }
      aria-label={verticalMode ? 'Previous slide (up)' : 'Previous slide'}
    >
      {verticalMode ? '▲' : isRTL && !verticalMode ? '▶' : '◀'}
    </button>
  );

  const NextButton = (
    <button
      onClick={handleNext}
      className={styles.nextArrow}
      disabled={
        !infinite &&
        (isRTL
          ? state.currentIndex >= totalItems - itemsToShow
          : state.currentIndex >= totalItems - itemsToShow)
      }
      aria-label={verticalMode ? 'Next slide (down)' : 'Next slide'}
    >
      {verticalMode ? '▼' : isRTL && !verticalMode ? '◀' : '▶'}
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
      {PrevButton}

      {/* Frame container - wraps the track */}
      <div
        ref={frameRef}
        className={`${styles.frame} ${isDragModeActive ? styles.dragging : ''}`}
        style={{
          // Frame width adjusts based on edge position
          // Edge slides (first/last): full + peek on one side
          // Middle slides: peek on both sides
          maxWidth: frameMaxWidth,
          // Add will-change to improve performance
          willChange: 'contents',
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
            willChange: 'transform', // Optimize for transform changes
            backfaceVisibility: 'hidden', // Prevent flickering
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {itemsToRender.map(({ index, content }, renderIndex) => {
            // Only apply fixed height in vertical mode if we have a valid calculated height
            const slideStyle = verticalMode
              ? slideHeight > 0
                ? { height: `${slideHeight}px` }
                : { flex: `1 0 ${100 / itemsToShow}%` } // Fallback to percentage-based height
              : {
                  width: slideWidth > 0 ? `${slideWidth}px` : 'auto',
                };

            // Use renderIndex as key to ensure uniqueness within this carousel's rendered items
            // In infinite mode, the same content index can appear multiple times in the array,
            // so we need to use renderIndex (position in array) instead of index (content index)
            const key = `slide-${renderIndex}`;

            return (
              <div
                data-renderindex={renderIndex}
                data-index={index}
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
      {NextButton}
    </div>
  );
};
