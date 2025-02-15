interface GetItemsToRenderParams {
  currentIndex: number;
  totalItems: number;
  itemsToShow: number;
  itemsToMove: number;
  circular: boolean;
}

export const getItemsToRender = ({
  currentIndex,
  totalItems,
  itemsToShow,
  itemsToMove,
  circular,
}: GetItemsToRenderParams): number[] => {
  if (!circular) {
    // Linear list - show current group plus one move-set for animation
    const start = Math.max(0, currentIndex - itemsToMove);
    const end = Math.min(totalItems, currentIndex + itemsToShow + itemsToMove);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  const itemsToRenderIndexes: number[] = [];

  // Helper function to handle negative indices
  const getCircularIndex = (index: number) => {
    return ((index % totalItems) + totalItems) % totalItems;
  };

  // Add prev offset group (only itemsToMove items needed)
  for (let i = 0; i < itemsToMove; i++) {
    const index = getCircularIndex(currentIndex - itemsToMove + i);
    itemsToRenderIndexes.push(index);
  }

  // Add current visible group
  for (let i = 0; i < itemsToShow; i++) {
    const index = getCircularIndex(currentIndex + i);
    itemsToRenderIndexes.push(index);
  }

  // Add next offset group (only itemsToMove items needed)
  for (let i = 0; i < itemsToMove; i++) {
    const index = getCircularIndex(currentIndex + itemsToShow + i);
    itemsToRenderIndexes.push(index);
  }

  return itemsToRenderIndexes;
};
