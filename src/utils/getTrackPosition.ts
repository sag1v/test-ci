interface GetTrackPositionParams {
  currentIndex: number;
  totalItems: number;
  itemsToShow: number;
  slideWidth: number;
  slideHeight?: number;
  itemsToMove?: number;
  circular: boolean;
  animationOffset: number;
  isRTL: boolean;
  isVertical?: boolean;
  peekSize?: number;
}

interface CalculateBaseOffsetParams {
  index: number;
  totalItems: number;
  itemsToShow: number;
  slideSize: number;
  itemsToMove?: number;
  circular: boolean;
  peekSize?: number;
}

/**
 * Calculates the base offset (without animation) for a given index
 * This is used both for positioning and for calculating animation offsets
 */
export const calculateBaseOffset = ({
  index,
  totalItems,
  itemsToShow,
  slideSize,
  itemsToMove = 1,
  circular,
  peekSize = 0,
}: CalculateBaseOffsetParams): number => {
  // Ensure we have valid values
  if (!slideSize || slideSize <= 0) {
    return 0;
  }

  // Check if we're at edge slides (only relevant for non-circular mode)
  const isAtFirstSlide = index === 0;
  const isAtLastSlide = index >= totalItems - itemsToShow;

  let baseOffset = 0;

  if (!circular) {
    // In non-circular mode, calculate offset as if all items from index 0 are present
    // This ensures consistent reference frame for animation calculations
    if (isAtFirstSlide) {
      // At start - no items on the left
      baseOffset = 0;
    } else if (isAtLastSlide) {
      // At end - show full peekSize of previous slide on the left (no peek on right)
      baseOffset = -slideSize * (index - peekSize);
    } else {
      // Middle slides
      // Position the track so that peekSize/2 of the previous slide
      // is visible on the left (and peekSize/2 of next slide on the right).
      baseOffset = -slideSize * (index - peekSize / 2);
    }
  } else {
    // Circular mode - always show peekSize/2 on each side
    const peekItemCount = peekSize > 0 ? 1 : 0;
    baseOffset = -slideSize * (itemsToMove + peekItemCount - peekSize / 2);
  }

  return baseOffset;
};

/**
 * Calculates the track position in pixels
 *
 * In circular mode:
 * - Always leaves space for prev items (-itemsToMove * slideWidth)
 * - With peekSize, also accounts for peek items
 *
 * In non-circular mode:
 * - At start: Aligns to start (0)
 * - At end: Aligns to show last set of items
 * - In middle: Leaves space for prev items and peek items
 */
export const getTrackPosition = ({
  currentIndex,
  totalItems,
  itemsToShow,
  slideWidth,
  slideHeight = 0,
  itemsToMove = 1,
  circular,
  animationOffset,
  isRTL,
  isVertical = false,
  peekSize = 0,
}: GetTrackPositionParams): number => {
  // Use the appropriate slide size based on orientation
  const slideSize = isVertical ? slideHeight : slideWidth;

  // Calculate base offset using the helper function
  const baseOffset = calculateBaseOffset({
    index: currentIndex,
    totalItems,
    itemsToShow,
    slideSize,
    itemsToMove,
    circular,
    peekSize,
  });

  // In non-circular mode, adjust for items that aren't actually rendered
  let renderOffset = 0;
  if (!circular && currentIndex > 0) {
    // Calculate the first rendered item index (same logic as getItemsToRender)
    let firstRenderedIndex = currentIndex;

    const shouldAddPeekItems = peekSize > 0;
    if (shouldAddPeekItems && currentIndex > 0) {
      firstRenderedIndex -= 1;
    }

    if (currentIndex > 0) {
      firstRenderedIndex = Math.max(0, firstRenderedIndex - itemsToMove);
    }

    // Compensate for items not rendered before firstRenderedIndex
    renderOffset = slideSize * firstRenderedIndex;
  }

  // Add animation offset and render offset
  const position =
    (baseOffset + renderOffset) * (isRTL ? -1 : 1) + animationOffset;

  return position;
};
