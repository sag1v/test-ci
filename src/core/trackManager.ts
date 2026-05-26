import {
  CarouselCoreInstance,
  CarouselCoreOptions,
  TrackDetails,
} from './types';

interface MeasurementPoint {
  distance: number;
  timestamp: number;
}

export class TrackManager {
  private position: number = 0;
  private currentIndex: number = 0;
  private slideSize: number = 0;
  private totalItems: number = 0;
  private itemsToShow: number = 1;
  private itemsToMove: number = 1;
  private peekSize: number = 0;
  private infinite: boolean = false;
  private isRTL: boolean = false;
  private verticalMode: boolean = false;

  private measurementPoints: MeasurementPoint[] = [];
  private readonly maxMeasurements = 6;
  private readonly measurementWindow = 200; // ms

  public onPositionChange?: () => void;

  constructor(private instance: CarouselCoreInstance) {}

  update(
    options: CarouselCoreOptions,
    slideSize: number,
    totalItems: number
  ): void {
    this.slideSize = slideSize;
    this.totalItems = totalItems;
    this.itemsToShow = options.itemsToShow || 1;
    this.itemsToMove = options.itemsToMove || 1;
    this.peekSize = options.peekSize || 0;
    this.infinite = options.infinite || false;
    this.isRTL = options.isRTL || false;
    this.verticalMode = options.verticalMode || false;

    if (options.initialActiveIndex !== undefined) {
      this.currentIndex = options.initialActiveIndex;
      this.recalculatePosition();
    }
  }

  recalculatePosition(): void {
    // Calculate base position for current index
    const baseOffset = this.calculateBaseOffset(this.currentIndex);
    this.position = this.adjustForRTL(baseOffset);
  }

  private calculateBaseOffset(index: number): number {
    if (!this.slideSize || this.slideSize <= 0) {
      return 0;
    }

    // Clamp index to valid range
    let clampedIndex = index;
    if (!this.infinite) {
      clampedIndex = Math.max(
        0,
        Math.min(index, this.totalItems - this.itemsToShow)
      );
    } else {
      clampedIndex =
        ((index % this.totalItems) + this.totalItems) % this.totalItems;
    }

    const isAtFirstSlide = clampedIndex === 0;
    const isAtLastSlide = clampedIndex >= this.totalItems - this.itemsToShow;

    if (!this.infinite) {
      if (isAtFirstSlide) {
        return 0;
      } else if (isAtLastSlide) {
        return -this.slideSize * (clampedIndex - this.peekSize);
      } else {
        return -this.slideSize * (clampedIndex - this.peekSize / 2);
      }
    } else {
      // For infinite mode, calculate position relative to a virtual starting point
      return -this.slideSize * clampedIndex;
    }
  }

  private adjustForRTL(offset: number): number {
    return this.isRTL && !this.verticalMode ? -offset : offset;
  }

  indexToPosition(index: number): number {
    const baseOffset = this.calculateBaseOffset(index);
    return this.adjustForRTL(baseOffset);
  }

  positionToIndex(position: number): number {
    if (!this.slideSize || this.slideSize <= 0) {
      return this.currentIndex;
    }

    const adjustedPosition =
      this.isRTL && !this.verticalMode ? -position : position;
    const slidesMoved = Math.round(-adjustedPosition / this.slideSize);
    let targetIndex = this.currentIndex + slidesMoved;

    if (!this.infinite) {
      targetIndex = Math.max(
        0,
        Math.min(targetIndex, this.totalItems - this.itemsToShow)
      );
    } else {
      targetIndex =
        ((targetIndex % this.totalItems) + this.totalItems) % this.totalItems;
    }

    return targetIndex;
  }

  getNearestIndex(position: number): number {
    if (!this.slideSize || this.slideSize <= 0) {
      return this.currentIndex;
    }

    // Find the nearest slide position to the current position
    let nearestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < this.totalItems; i++) {
      const slidePos = this.indexToPosition(i);
      const distance = Math.abs(position - slidePos);

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    // Clamp to valid range
    if (!this.infinite) {
      nearestIndex = Math.max(
        0,
        Math.min(nearestIndex, this.totalItems - this.itemsToShow)
      );
    } else {
      nearestIndex =
        ((nearestIndex % this.totalItems) + this.totalItems) % this.totalItems;
    }

    return nearestIndex;
  }

  getMinPosition(): number {
    if (this.infinite) {
      return -Infinity;
    }
    return this.indexToPosition(0);
  }

  getMaxPosition(): number {
    if (this.infinite) {
      return Infinity;
    }
    return this.indexToPosition(
      Math.max(0, this.totalItems - this.itemsToShow)
    );
  }

  measure(distance: number): void {
    const now = Date.now();
    this.measurementPoints.push({
      distance,
      timestamp: now,
    });

    // Keep only recent measurements
    this.measurementPoints = this.measurementPoints.filter(
      (point) => now - point.timestamp <= this.measurementWindow
    );

    // Limit to max measurements
    if (this.measurementPoints.length > this.maxMeasurements) {
      this.measurementPoints = this.measurementPoints.slice(
        -this.maxMeasurements
      );
    }
  }

  getVelocity(): number {
    const now = Date.now();
    const data = this.measurementPoints.reduce(
      (acc, point) => {
        const timeDelta = now - point.timestamp;
        if (timeDelta > this.measurementWindow) {
          return acc;
        }

        // Only count movements in same direction
        if (
          acc.lastTimestamp &&
          Math.sign(point.distance) !== Math.sign(acc.distance) &&
          acc.distance !== 0
        ) {
          return { distance: 0, lastTimestamp: 0, time: 0 };
        }

        if (acc.lastTimestamp) {
          acc.time += point.timestamp - acc.lastTimestamp;
        }
        acc.distance += point.distance;
        acc.lastTimestamp = point.timestamp;
        return acc;
      },
      { distance: 0, lastTimestamp: 0, time: 0 }
    );

    return data.time > 0 ? data.distance / data.time : 0;
  }

  setPosition(position: number): void {
    const delta = position - this.position;
    this.measure(delta);
    const oldIndex = this.currentIndex;
    this.position = position;
    this.currentIndex = this.positionToIndex(position);

    if (oldIndex !== this.currentIndex) {
      this.instance.emit('indexChanged', {
        oldIndex,
        newIndex: this.currentIndex,
      });
    }
    this.instance.emit('positionChanged');
    if (this.onPositionChange) {
      this.onPositionChange();
    }
  }

  addPosition(delta: number): void {
    this.measure(delta);
    const oldIndex = this.currentIndex;

    // Apply the delta
    this.position += delta;

    // Enforce boundaries
    const minPos = this.getMinPosition();
    const maxPos = this.getMaxPosition();

    if (!this.infinite) {
      // Clamp to boundaries in non-infinite mode
      if (this.position < minPos) {
        this.position = minPos;
      } else if (this.position > maxPos) {
        this.position = maxPos;
      }
    }

    // Update index based on new position
    this.currentIndex = this.positionToIndex(this.position);

    if (oldIndex !== this.currentIndex) {
      this.instance.emit('indexChanged', {
        oldIndex,
        newIndex: this.currentIndex,
      });
    }
    this.instance.emit('positionChanged');
    if (this.onPositionChange) {
      this.onPositionChange();
    }
  }

  getPosition(): number {
    return this.position;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  setCurrentIndex(index: number): void {
    this.currentIndex = index;
    this.recalculatePosition();
  }

  getDetails(): TrackDetails {
    return {
      currentIndex: this.currentIndex,
      position: this.position,
      min: this.getMinPosition(),
      max: this.getMaxPosition(),
      slideSize: this.slideSize,
      totalItems: this.totalItems,
    };
  }
}
