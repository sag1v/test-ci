import { getItemsToRender } from '../../src/utils/getItemsToRender';

describe('getItemsToRender', () => {
  describe('Linear list (non-circular)', () => {
    it('should show [current, next] at start', () => {
      const items = getItemsToRender({
        currentIndex: 0,
        totalItems: 5,
        itemsToShow: 1,
        itemsToMove: 1,
        circular: false,
      });

      expect(items).toEqual([0, 1]);
    });

    it('should show [prev, current, next] in middle', () => {
      const items = getItemsToRender({
        currentIndex: 2,
        totalItems: 5,
        itemsToShow: 1,
        itemsToMove: 1,
        circular: false,
      });

      expect(items).toEqual([1, 2, 3]);
    });

    it('should show [prev, current] at end', () => {
      const items = getItemsToRender({
        currentIndex: 4,
        totalItems: 5,
        itemsToShow: 1,
        itemsToMove: 1,
        circular: false,
      });

      expect(items).toEqual([3, 4]);
    });

    it('should handle multiple items to show', () => {
      const items = getItemsToRender({
        currentIndex: 1,
        totalItems: 5,
        itemsToShow: 3,
        itemsToMove: 1,
        circular: false,
      });

      expect(items).toEqual([0, 1, 2, 3, 4]);
    });
  });

  describe('Circular list', () => {
    it('should show [prevOffset, current, nextOffset] for single item movement', () => {
      const items = getItemsToRender({
        currentIndex: 0,
        totalItems: 5,
        itemsToShow: 1,
        itemsToMove: 1,
        circular: true,
      });

      expect(items).toEqual([4, 0, 1]);
    });

    it('should show [prevOffset, visible, nextOffset] for multiple items', () => {
      const items = getItemsToRender({
        currentIndex: 2,
        totalItems: 5,
        itemsToShow: 3,
        itemsToMove: 3,
        circular: true,
      });

      expect(items).toEqual([
        4,
        0,
        1, // prevOffsetGroup (for backward movement)
        2,
        3,
        4, // visibleGroup (currently visible)
        0,
        1,
        2, // nextOffsetGroup (for forward movement)
      ]);
    });

    it('should handle negative indices when moving backwards', () => {
      const items = getItemsToRender({
        currentIndex: -1, // Test negative index
        totalItems: 5,
        itemsToShow: 1,
        itemsToMove: 1,
        circular: true,
      });

      expect(items).toEqual([3, 4, 0]); // 3: prev, 4: current (-1 wrapped), 0: next
    });

    it('should handle multiple negative indices', () => {
      const items = getItemsToRender({
        currentIndex: -2,
        totalItems: 5,
        itemsToShow: 1,
        itemsToMove: 1,
        circular: true,
      });

      expect(items).toEqual([2, 3, 4]); // 2: prev, 3: current (-2 wrapped), 4: next
    });

    it('should handle negative indices with multiple items to show', () => {
      const items = getItemsToRender({
        currentIndex: -1,
        totalItems: 5,
        itemsToShow: 2,
        itemsToMove: 2,
        circular: true,
      });

      expect(items).toEqual([
        2,
        3, // prev group
        4,
        0, // current group (-1 wrapped)
        1,
        2, // next group
      ]);
    });
  });
});
