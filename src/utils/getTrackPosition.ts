interface GetTrackPositionParams {
  currentIndex: number;
  totalItems: number;
  itemsToShow: number;
  itemsToMove: number;
  slideWidth: number;
  slideHeight?: number;
  itemsToRenderCount: number;
  circular: boolean;
  animationOffset: number;
  isRTL: boolean;
  isVertical?: boolean;
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
  slideHeight = 0,
  itemsToRenderCount,
  circular,
  animationOffset,
  isRTL,
  isVertical = false,
}: GetTrackPositionParams): number => {
  // Use the appropriate slide size based on orientation
  const slideSize = isVertical ? slideHeight : slideWidth;

  // Ensure we have valid values
  if (!slideSize || slideSize <= 0) {
    return 0;
  }

  let baseOffset = 0;

  if (!circular) {
    if (currentIndex === 0) {
      // At start - align to start
      baseOffset = 0;
    } else if (currentIndex >= totalItems - itemsToShow) {
      // At end - align to end
      baseOffset = -slideSize * (itemsToRenderCount - itemsToShow);
    } else {
      // In middle - leave space for prev items
      baseOffset = -slideSize * itemsToMove;
    }
  } else {
    // Circular mode - always leave space for prev items
    baseOffset = -slideSize * itemsToMove;
  }

  // Add animation offset
  const position = baseOffset * (isRTL ? -1 : 1) + animationOffset;

  return position;
};
