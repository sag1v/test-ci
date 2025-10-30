interface GetItemsToRenderParams {
  currentIndex: number;
  totalItems: number;
  itemsToShow: number;
  itemsToMove: number;
  circular: boolean;
  peekSize?: number;
}

export const getItemsToRender = ({
  currentIndex,
  totalItems,
  itemsToShow,
  itemsToMove,
  circular,
  peekSize = 0,
}: GetItemsToRenderParams): number[] => {
  // Ensure peekSize is within valid range (0 to 1)
  const validPeekSize = Math.max(0, Math.min(1, peekSize));

  // Only add peek items if peekSize > 0
  const shouldAddPeekItems = validPeekSize > 0;

  if (!circular) {
    // Non-infinite carousel
    let start = currentIndex;
    let end = currentIndex + itemsToShow;

    // Add peek items according to position
    if (shouldAddPeekItems) {
      // Add peek item to the left if not at the start
      if (currentIndex > 0) {
        start -= 1;
      }

      // Add peek item to the right if not at the end
      if (currentIndex < totalItems - itemsToShow) {
        end += 1;
      }
    }

    // Add items needed for animation (forward and backward)
    // Add on the left for backward animation (but don't go below 0)
    if (currentIndex > 0) {
      start = Math.max(0, start - itemsToMove);
    }
    // Add on the right for forward animation
    end = Math.min(totalItems, end + itemsToMove);

    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  // Infinite carousel - always render peek items on both sides
  const itemsToRenderIndexes: number[] = [];

  // Helper function to handle circular index calculation
  const getCircularIndex = (index: number) => {
    return ((index % totalItems) + totalItems) % totalItems;
  };

  // Add items for animation and peek on the left side
  const leftAddition = itemsToMove + (shouldAddPeekItems ? 1 : 0);
  for (let i = 0; i < leftAddition; i++) {
    const index = getCircularIndex(currentIndex - leftAddition + i);
    itemsToRenderIndexes.push(index);
  }

  // Add visible items
  for (let i = 0; i < itemsToShow; i++) {
    const index = getCircularIndex(currentIndex + i);
    itemsToRenderIndexes.push(index);
  }

  // Add items for animation and peek on the right side
  const rightAddition = itemsToMove + (shouldAddPeekItems ? 1 : 0);
  for (let i = 0; i < rightAddition; i++) {
    const index = getCircularIndex(currentIndex + itemsToShow + i);
    itemsToRenderIndexes.push(index);
  }

  return itemsToRenderIndexes;
};
