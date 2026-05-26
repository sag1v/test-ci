export interface CarouselCoreOptions {
  infinite?: boolean;
  itemsToShow?: number;
  itemsToMove?: number;
  peekSize?: number;
  verticalMode?: boolean;
  isRTL?: boolean;
  freeMode?: boolean;
  freeSnapMode?: boolean;
  initialActiveIndex?: number;
  onChange?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export interface TrackDetails {
  currentIndex: number;
  position: number;
  min: number;
  max: number;
  slideSize: number;
  totalItems: number;
}

export interface CarouselTrackManager {
  getNearestIndex(position: number): number;
  update(
    options: CarouselCoreOptions,
    slideSize: number,
    totalItems: number
  ): void;
  onPositionChange?: () => void;
  setCurrentIndex(index: number): void;
  getDetails(): TrackDetails;
  setPosition(position: number): void;
  addPosition(delta: number): void;
  indexToPosition(index: number): number;
  getVelocity(): number;
}

export interface CarouselCoreInstance {
  // Track management
  readonly trackDetails: TrackDetails | null;
  trackManager: CarouselTrackManager;

  // Control methods
  moveToIndex(index: number, animate?: boolean): void;
  next(): void;
  prev(): void;

  // Position control
  setPosition(position: number): void;
  addPosition(delta: number): void;

  // Update lifecycle
  update(options?: Partial<CarouselCoreOptions>): void;
  destroy(): void;

  // Event system
  on(event: string, callback: (data?: unknown) => void): void;
  off(event: string, callback: (data?: unknown) => void): void;
  emit(event: string, data?: unknown): void;

  // Velocity
  getVelocity(): number;

  // State
  isAnimating: boolean;
  isDragging: boolean;

  // Options and dimensions
  options: CarouselCoreOptions;
  slideSize: number;
  totalItems: number;
  frameSize: number;
}

export type CarouselCorePlugin = (
  instance: CarouselCoreInstance
) => void | (() => void); // Can return cleanup function
