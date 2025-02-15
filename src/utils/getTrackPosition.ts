interface GetTrackPositionParams {
  currentIndex: number;
  totalItems: number;
  itemsToShow: number;
  itemsToMove: number;
  slideWidth: number;
  itemsToRenderCount: number;
  circular: boolean;
  animationOffset: number;
  isRTL: boolean;
}

/**
 * Calculates the track position in pixels
 *
 * In circular mode:
 * - Always leaves space for prev items (-itemsToMove * slideWidth)
 *
 * In non-circular mode:
 * - At start: Aligns to start (0)
 * - At end: Aligns to show last set of items
 * - In middle: Leaves space for prev items
 */
export const getTrackPosition = ({
  currentIndex,
  totalItems,
  itemsToShow,
  itemsToMove,
  slideWidth,
  itemsToRenderCount,
  circular,
  animationOffset,
  isRTL,
}: GetTrackPositionParams): number => {
  let baseOffset = 0;

  if (!circular) {
    if (currentIndex === 0) {
      // At start - align to start
      baseOffset = 0;
    } else if (currentIndex >= totalItems - itemsToShow) {
      // At end - align to end
      baseOffset = -slideWidth * (itemsToRenderCount - itemsToShow);
    } else {
      // In middle - leave space for prev items
      baseOffset = -slideWidth * itemsToMove;
    }
  } else {
    // Circular mode - always leave space for prev items
    baseOffset = -slideWidth * itemsToMove;
  }

  return isRTL ? -(baseOffset + animationOffset) : baseOffset + animationOffset;
};
