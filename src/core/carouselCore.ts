import { AnimationEngine } from './animationEngine';
import { DragHandler } from './dragHandler';
import {
  CarouselCoreInstance,
  CarouselCoreOptions,
  CarouselCorePlugin,
  TrackDetails,
} from './types';
import { TrackManager } from './trackManager';

export class CarouselCore implements CarouselCoreInstance {
  public isAnimating: boolean = false;
  public isDragging: boolean = false;
  public trackDetails: TrackDetails | null = null;

  private container: HTMLElement | null = null;
  private trackElement: HTMLElement | null = null;
  public options: CarouselCoreOptions;
  public trackManager: TrackManager;
  private animationEngine: AnimationEngine;
  private dragHandler: DragHandler;
  private plugins: Array<(() => void) | void> = [];
  private eventListeners: Map<string, Array<(data?: unknown) => void>> =
    new Map();

  // Dimensions
  public slideSize: number = 0;
  public totalItems: number = 0;
  public frameSize: number = 0;

  constructor(
    container: HTMLElement,
    trackElement: HTMLElement,
    options: CarouselCoreOptions = {},
    plugins: CarouselCorePlugin[] = []
  ) {
    this.container = container;
    this.trackElement = trackElement;
    this.options = { ...options };

    // Initialize core components
    this.trackManager = new TrackManager(this);
    this.animationEngine = new AnimationEngine(this);
    this.dragHandler = new DragHandler(this);

    // Initialize plugins
    plugins.forEach((plugin) => {
      const cleanup = plugin(this);
      if (cleanup) {
        this.plugins.push(cleanup);
      }
    });

    this.init();
  }

  private init(): void {
    this.calculateDimensions();
    this.trackManager.update(this.options, this.slideSize, this.totalItems);

    // Listen to track position changes
    this.trackManager.onPositionChange = () => {
      this.updateTrackDetails();
      this.applyTransform();
    };

    this.updateTrackDetails();

    if (this.options.initialActiveIndex !== undefined) {
      this.trackManager.setCurrentIndex(this.options.initialActiveIndex);
    }

    this.dragHandler.init(this.container!, this.options, this.frameSize);

    this.emit('created');
  }

  public update(options?: Partial<CarouselCoreOptions>): void {
    if (options) {
      this.options = { ...this.options, ...options };
    }

    this.calculateDimensions();
    this.trackManager.update(this.options, this.slideSize, this.totalItems);
    this.updateTrackDetails();
    this.applyTransform();
    this.emit('updated');
  }

  private calculateDimensions(): void {
    if (!this.container || !this.trackElement) {
      return;
    }

    const containerRect = this.container.getBoundingClientRect();
    this.frameSize = this.options.verticalMode
      ? containerRect.height
      : containerRect.width;

    // Calculate slide size based on itemsToShow
    const itemsToShow = this.options.itemsToShow || 1;
    const peekSize = this.options.peekSize || 0;
    const effectiveItemsToShow =
      peekSize > 0 ? itemsToShow + peekSize : itemsToShow;

    this.slideSize = Math.floor(this.frameSize / effectiveItemsToShow);
  }

  public setTotalItems(count: number): void {
    this.totalItems = count;
    this.trackManager.update(this.options, this.slideSize, this.totalItems);
    this.updateTrackDetails();
  }

  private updateTrackDetails(): void {
    this.trackDetails = this.trackManager.getDetails();
    this.emit('detailsChanged');
  }

  private applyTransform(): void {
    if (!this.trackElement || !this.trackDetails) {
      return;
    }

    const position = this.trackDetails.position;
    const transform = this.options.verticalMode
      ? `translate3d(0, ${position}px, 0)`
      : `translate3d(${position}px, 0, 0)`;

    this.trackElement.style.transform = transform;
    this.trackElement.style.webkitTransform = transform;
  }

  // Track control methods
  public setPosition(position: number): void {
    this.animationEngine.stop();
    this.trackManager.setPosition(position);
    this.applyTransform();
  }

  public addPosition(delta: number): void {
    this.animationEngine.stop();

    // Stop any ongoing animations when dragging starts
    if (!this.isDragging) {
      this.isDragging = true;
      this.emit('dragStarted');
    }

    this.trackManager.addPosition(delta);
    this.applyTransform();
  }

  public moveToIndex(index: number, animate: boolean = true): void {
    if (!this.trackDetails) {
      return;
    }

    // Clamp index to valid range
    let clampedIndex = index;
    if (!this.options.infinite) {
      clampedIndex = Math.max(
        0,
        Math.min(index, this.totalItems - (this.options.itemsToShow || 1))
      );
    } else {
      clampedIndex =
        ((index % this.totalItems) + this.totalItems) % this.totalItems;
    }

    const targetPosition = this.trackManager.indexToPosition(clampedIndex);
    const currentPosition = this.trackDetails.position;
    const distance = targetPosition - currentPosition;

    if (Math.abs(distance) < 0.1) {
      // Already at target, just update index if needed
      if (this.trackDetails.currentIndex !== clampedIndex) {
        this.trackManager.setCurrentIndex(clampedIndex);
      }
      return;
    }

    // Reset dragging state before animation
    this.isDragging = false;

    if (animate) {
      const duration = 300; // Faster snap animation
      const easing = (t: number) => 1 + --t * t * t * t * t; // ease-out-quint
      this.isAnimating = true;
      this.animationEngine.start([
        {
          distance,
          duration,
          easing,
        },
      ]);
    } else {
      this.setPosition(targetPosition);
    }
  }

  public next(): void {
    if (!this.trackDetails) {
      return;
    }
    const nextIndex =
      this.trackDetails.currentIndex + (this.options.itemsToMove || 1);
    this.moveToIndex(nextIndex);
    this.options.onNext?.();
  }

  public prev(): void {
    if (!this.trackDetails) {
      return;
    }
    const prevIndex =
      this.trackDetails.currentIndex - (this.options.itemsToMove || 1);
    this.moveToIndex(prevIndex);
    this.options.onPrev?.();
  }

  // Velocity
  public getVelocity(): number {
    return this.trackManager.getVelocity();
  }

  // Event system
  public on(event: string, callback: (data?: unknown) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  public off(event: string, callback: (data?: unknown) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  public emit(event: string, data?: unknown): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  public destroy(): void {
    this.animationEngine.stop();
    this.dragHandler.destroy();
    this.plugins.forEach((cleanup) => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    });
    this.eventListeners.clear();
    this.emit('destroyed');
  }
}
