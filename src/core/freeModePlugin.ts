import { CarouselCoreInstance } from './types';

export function createFreeModePlugin(): (
  instance: CarouselCoreInstance
) => void | (() => void) {
  return (instance: CarouselCoreInstance) => {
    let momentumAnimationId: number | null = null;
    let freeModeOffset: number = 0;
    const options = instance.options;

    const isFreeMode = options.freeMode || options.freeSnapMode;
    if (!isFreeMode) {
      return;
    }

    const baseFriction = 0.95;
    const boundaryFriction = 0.88;
    const snapFriction = 0.92;
    const minVelocity = 0.01;

    function applyRubberband(distance: number, currentOffset: number): number {
      if (options.infinite) {
        return distance;
      }

      const details = instance.trackDetails;
      if (!details) {
        return distance;
      }

      const slideSize = details.slideSize;
      const currentPosition = details.position + currentOffset;
      const newPosition = currentPosition + distance;

      // Check boundaries
      if (newPosition < details.min) {
        const overflow = (newPosition - details.min) / slideSize;
        const breakFactor = 2;
        const frameSize = instance.frameSize || window.innerWidth;
        const overflowedSize = Math.abs(overflow * slideSize);
        const resistance = Math.max(
          0,
          1 - (overflowedSize / frameSize) * breakFactor
        );
        return distance * resistance * resistance;
      }

      if (newPosition > details.max) {
        const overflow = (newPosition - details.max) / slideSize;
        const breakFactor = 2;
        const frameSize = instance.frameSize || window.innerWidth;
        const overflowedSize = Math.abs(overflow * slideSize);
        const resistance = Math.max(
          0,
          1 - (overflowedSize / frameSize) * breakFactor
        );
        return distance * resistance * resistance;
      }

      return distance;
    }

    function calculateFreeModeBounds(currentOffset: number): {
      offset: number;
      isAtBoundary: boolean;
    } {
      const details = instance.trackDetails;
      if (!details) {
        return { offset: currentOffset, isAtBoundary: false };
      }

      if (options.infinite) {
        return { offset: currentOffset, isAtBoundary: false };
      }

      const currentPosition = details.position + currentOffset;
      const boundedPosition = Math.max(
        details.max,
        Math.min(details.min, currentPosition)
      );
      const isAtBoundary = Math.abs(currentPosition - boundedPosition) > 0.1;

      return {
        offset: boundedPosition - details.position,
        isAtBoundary,
      };
    }

    function startMomentumAnimation(
      initialVelocityX: number,
      initialVelocityY: number,
      initialOffset: number
    ): void {
      if (momentumAnimationId !== null) {
        cancelAnimationFrame(momentumAnimationId);
      }

      let velocityX = initialVelocityX;
      let velocityY = initialVelocityY;
      let currentOffset = initialOffset;
      let lastFrameTime = performance.now();

      const animate = (currentTime: number) => {
        const deltaTime = Math.min((currentTime - lastFrameTime) / 16.67, 2);
        lastFrameTime = currentTime;

        const deltaX = velocityX * deltaTime * 16.67;
        const deltaY = velocityY * deltaTime * 16.67;
        const delta = options.verticalMode ? deltaY : deltaX;
        const adjustedDelta =
          options.isRTL && !options.verticalMode ? -delta : delta;

        // Apply rubberband
        const rubberbandDelta = applyRubberband(adjustedDelta, currentOffset);
        currentOffset += rubberbandDelta;

        // Apply bounds
        const { offset: boundedOffset, isAtBoundary } =
          calculateFreeModeBounds(currentOffset);

        // Determine friction
        let friction = baseFriction;
        if (isAtBoundary) {
          friction = boundaryFriction;
        } else if (options.freeSnapMode) {
          friction = snapFriction;
        }

        if (isAtBoundary && Math.abs(adjustedDelta) > 0.1) {
          velocityX *= friction * 0.9;
          velocityY *= friction * 0.9;
        }

        currentOffset = boundedOffset;
        velocityX *= friction;
        velocityY *= friction;

        // Update position
        const details = instance.trackDetails;
        if (details) {
          instance.setPosition(details.position + currentOffset);
        }

        if (
          Math.abs(velocityX) > minVelocity ||
          Math.abs(velocityY) > minVelocity
        ) {
          momentumAnimationId = requestAnimationFrame(animate);
        } else {
          momentumAnimationId = null;

          if (options.freeSnapMode) {
            // Snap to nearest slide
            const details = instance.trackDetails;
            if (details) {
              const nearestIndex = instance.trackManager?.getNearestIndex(
                details.position + currentOffset
              );
              if (nearestIndex !== undefined) {
                instance.moveToIndex(nearestIndex, true);
              }
            }
          }
        }
      };

      momentumAnimationId = requestAnimationFrame(animate);
    }

    function handleDragEnd(data?: unknown) {
      const payload = data as
        | {
            velocity?: { velocityX: number; velocityY: number };
          }
        | undefined;
      if (!payload?.velocity) {
        return;
      }

      const { velocityX, velocityY } = payload.velocity;
      const minVelocityThreshold = 0.1;

      const hasSignificantVelocity =
        Math.abs(velocityX) > minVelocityThreshold ||
        Math.abs(velocityY) > minVelocityThreshold;

      if (hasSignificantVelocity) {
        const details = instance.trackDetails;
        if (details) {
          const currentOffset = freeModeOffset;
          startMomentumAnimation(velocityX, velocityY, currentOffset);
        }
      } else if (options.freeSnapMode) {
        // Snap immediately if no velocity
        const details = instance.trackDetails;
        if (details) {
          const nearestIndex = instance.trackManager?.getNearestIndex(
            details.position + freeModeOffset
          );
          if (nearestIndex !== undefined) {
            instance.moveToIndex(nearestIndex, true);
          }
        }
      }
    }

    function handleDragged(data?: unknown) {
      const payload = data as
        | {
            delta?: number;
            deltaX?: number;
            deltaY?: number;
          }
        | undefined;
      if (!payload?.delta) {
        return;
      }

      const details = instance.trackDetails;
      if (!details) {
        return;
      }

      const delta = payload.delta * instance.frameSize; // Convert normalized delta to pixels
      freeModeOffset += delta;

      const { offset: boundedOffset } = calculateFreeModeBounds(freeModeOffset);
      freeModeOffset = boundedOffset;

      // Update position with free mode offset
      instance.setPosition(details.position + freeModeOffset);
    }

    function handleDetailsChanged() {
      // Reset free mode offset when details change significantly
      freeModeOffset = 0;
    }

    instance.on('dragEnded', handleDragEnd);
    instance.on('dragged', handleDragged);
    instance.on('detailsChanged', handleDetailsChanged);

    return () => {
      if (momentumAnimationId !== null) {
        cancelAnimationFrame(momentumAnimationId);
      }
      instance.off('dragEnded', handleDragEnd);
      instance.off('dragged', handleDragged);
      instance.off('detailsChanged', handleDetailsChanged);
    };
  };
}
