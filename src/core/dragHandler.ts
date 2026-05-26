import { CarouselCoreInstance, CarouselCoreOptions } from './types';

interface DragState {
  isActive: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
  lastMoveTime: number;
  lastMoveX: number;
  lastMoveY: number;
  previousMoveTime: number;
  previousMoveX: number;
  previousMoveY: number;
}

export class DragHandler {
  private dragState: DragState = {
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startTime: 0,
    lastMoveTime: 0,
    lastMoveX: 0,
    lastMoveY: 0,
    previousMoveTime: 0,
    previousMoveX: 0,
    previousMoveY: 0,
  };

  private container: HTMLElement | null = null;
  private options: CarouselCoreOptions = {};
  private frameSize: number = 0;
  private isVertical: boolean = false;
  private isRTL: boolean = false;

  constructor(private instance: CarouselCoreInstance) {}

  init(
    container: HTMLElement,
    options: CarouselCoreOptions,
    frameSize: number
  ): void {
    this.container = container;
    this.options = options;
    this.frameSize = frameSize;
    this.isVertical = options.verticalMode || false;
    this.isRTL = options.isRTL || false;

    this.attachListeners();
  }

  private attachListeners(): void {
    if (!this.container) {
      return;
    }

    // Touch events
    this.container.addEventListener('touchstart', this.handleTouchStart, {
      passive: true,
    });
    this.container.addEventListener('touchmove', this.handleTouchMove, {
      passive: false,
    });
    this.container.addEventListener('touchend', this.handleTouchEnd);
    this.container.addEventListener('touchcancel', this.handleTouchEnd);

    // Mouse events
    this.container.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    this.container.addEventListener('mouseleave', this.handleMouseLeave);
  }

  private detachListeners(): void {
    if (!this.container) {
      return;
    }

    this.container.removeEventListener('touchstart', this.handleTouchStart);
    this.container.removeEventListener('touchmove', this.handleTouchMove);
    this.container.removeEventListener('touchend', this.handleTouchEnd);
    this.container.removeEventListener('touchcancel', this.handleTouchEnd);
    this.container.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.container.removeEventListener('mouseleave', this.handleMouseLeave);
  }

  private getXY(e: TouchEvent | MouseEvent): { x: number; y: number } {
    if ('touches' in e) {
      return {
        x: e.touches[0]?.clientX || 0,
        y: e.touches[0]?.clientY || 0,
      };
    }
    return { x: e.clientX, y: e.clientY };
  }

  private handleTouchStart = (e: TouchEvent): void => {
    const { x, y } = this.getXY(e);
    const now = Date.now();
    this.dragState = {
      isActive: true,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      startTime: now,
      lastMoveTime: now,
      lastMoveX: x,
      lastMoveY: y,
      previousMoveTime: now,
      previousMoveX: x,
      previousMoveY: y,
    };
    this.instance.isDragging = true;
    this.instance.emit('dragStarted');
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (!this.dragState.isActive) {
      return;
    }
    e.preventDefault();

    const { x, y } = this.getXY(e);
    this.updateDrag(x, y);
  };

  private handleTouchEnd = (): void => {
    if (!this.dragState.isActive) {
      return;
    }

    this.finishDrag();
  };

  private handleMouseDown = (e: MouseEvent): void => {
    const { x, y } = this.getXY(e);
    const now = Date.now();
    this.dragState = {
      isActive: true,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      startTime: now,
      lastMoveTime: now,
      lastMoveX: x,
      lastMoveY: y,
      previousMoveTime: now,
      previousMoveX: x,
      previousMoveY: y,
    };
    this.instance.isDragging = true;
    this.instance.emit('dragStarted');
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.dragState.isActive) {
      return;
    }

    const { x, y } = this.getXY(e);
    this.updateDrag(x, y);
  };

  private handleMouseUp = (): void => {
    if (!this.dragState.isActive) {
      return;
    }

    this.finishDrag();
  };

  private handleMouseLeave = (): void => {
    if (!this.dragState.isActive) {
      return;
    }

    this.finishDrag();
  };

  private updateDrag(x: number, y: number): void {
    const now = Date.now();
    const deltaX = x - this.dragState.currentX;
    const deltaY = y - this.dragState.currentY;

    this.dragState.previousMoveTime = this.dragState.lastMoveTime;
    this.dragState.previousMoveX = this.dragState.lastMoveX;
    this.dragState.previousMoveY = this.dragState.lastMoveY;
    this.dragState.lastMoveTime = now;
    this.dragState.lastMoveX = x;
    this.dragState.lastMoveY = y;
    this.dragState.currentX = x;
    this.dragState.currentY = y;

    const delta = this.isVertical ? deltaY : deltaX;
    const adjustedDelta = this.isRTL && !this.isVertical ? -delta : delta;

    // Normalize delta by frame size (0-1 range)
    const normalizedDelta = adjustedDelta / this.frameSize;

    // Emit drag event with normalized delta
    // The core or plugins will handle converting to actual position
    this.instance.emit('dragged', {
      delta: normalizedDelta,
      deltaX,
      deltaY,
    });

    // Default behavior: add position if not in free mode
    if (!this.options.freeMode && !this.options.freeSnapMode) {
      // Convert normalized delta to actual pixel delta
      // normalizedDelta is in range -1 to 1, representing fraction of frame size
      const pixelDelta = normalizedDelta * this.frameSize;
      this.instance.addPosition(pixelDelta);
    }
  }

  private finishDrag(): void {
    if (!this.dragState.isActive) {
      return;
    }

    this.dragState.isActive = false;
    this.instance.isDragging = false;

    const velocity = this.getVelocity();
    this.instance.emit('dragEnded', { velocity });

    // Handle snapping for non-free modes
    if (!this.options.freeMode && !this.options.freeSnapMode) {
      this.handleSnap();
    }
  }

  private handleSnap(): void {
    const details = this.instance.trackDetails;
    if (!details) {
      return;
    }

    // Calculate nearest slide index
    const nearestIndex = this.instance.trackManager.getNearestIndex(
      details.position
    );

    // Snap to nearest slide
    this.instance.moveToIndex(nearestIndex, true);
  }

  private getVelocity(): { velocityX: number; velocityY: number } {
    const timeDelta =
      this.dragState.lastMoveTime - this.dragState.previousMoveTime;

    if (timeDelta > 0 && timeDelta < 100) {
      const deltaX = this.dragState.lastMoveX - this.dragState.previousMoveX;
      const deltaY = this.dragState.lastMoveY - this.dragState.previousMoveY;
      return {
        velocityX: deltaX / timeDelta,
        velocityY: deltaY / timeDelta,
      };
    }

    const totalTime = Date.now() - this.dragState.startTime;
    if (totalTime > 0) {
      const totalDistanceX = this.dragState.currentX - this.dragState.startX;
      const totalDistanceY = this.dragState.currentY - this.dragState.startY;
      return {
        velocityX: totalDistanceX / totalTime,
        velocityY: totalDistanceY / totalTime,
      };
    }

    return { velocityX: 0, velocityY: 0 };
  }

  destroy(): void {
    this.detachListeners();
  }
}
