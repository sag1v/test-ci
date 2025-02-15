import { getTrackPosition } from '../../src/utils/getTrackPosition';

describe('getTrackPosition', () => {
  const baseParams = {
    totalItems: 5,
    itemsToShow: 1,
    itemsToMove: 1,
    slideWidth: 100,
    itemsToRenderCount: 3,
    circular: false,
    animationOffset: 0,
    isRTL: false,
  };

  describe('Non-circular mode', () => {
    it('should align to start when at first slide', () => {
      const position = getTrackPosition({
        ...baseParams,
        currentIndex: 0,
      });
      expect(position).toBe(0);
    });

    it('should leave space for prev items in middle', () => {
      const position = getTrackPosition({
        ...baseParams,
        currentIndex: 2,
      });
      expect(position).toBe(-100); // -slideWidth * itemsToMove
    });

    it('should align to end when at last slide', () => {
      const position = getTrackPosition({
        ...baseParams,
        currentIndex: 4,
      });
      expect(position).toBe(-200); // -slideWidth * (visibleItemsCount - itemsToShow)
    });

    it('should include animation offset', () => {
      const position = getTrackPosition({
        ...baseParams,
        currentIndex: 2,
        animationOffset: -100,
      });
      expect(position).toBe(-200); // baseOffset + animationOffset
    });
  });

  describe('Circular mode', () => {
    it('should always leave space for prev items', () => {
      const position = getTrackPosition({
        ...baseParams,
        circular: true,
        currentIndex: 0,
      });
      expect(position).toBe(-100); // -slideWidth * itemsToMove
    });

    it('should include animation offset', () => {
      const position = getTrackPosition({
        ...baseParams,
        circular: true,
        currentIndex: 0,
        animationOffset: 100,
      });
      expect(position).toBe(0); // baseOffset + animationOffset
    });
  });

  describe('RTL mode', () => {
    it('should invert position in RTL mode', () => {
      const position = getTrackPosition({
        ...baseParams,
        currentIndex: 2,
        isRTL: true,
      });
      expect(position).toBe(100); // Inverted from -100
    });

    it('should handle animation offset in RTL mode', () => {
      const position = getTrackPosition({
        ...baseParams,
        currentIndex: 2,
        animationOffset: -100,
        isRTL: true,
      });
      expect(position).toBe(200); // Inverted from -200
    });
  });
});
