import { CarouselCoreInstance } from './types';

interface AnimationKeyframe {
  distance: number;
  duration: number;
  easing: (t: number) => number;
  earlyExit?: number;
}

export class AnimationEngine {
  private animationFrameId: number | null = null;
  private isActive: boolean = false;
  private keyframes: AnimationKeyframe[] = [];
  private currentKeyframeIndex: number = 0;
  private startTime: number = 0;
  private startPosition: number = 0;
  private totalDuration: number = 0;

  constructor(private instance: CarouselCoreInstance) {}

  start(keyframes: AnimationKeyframe[]): void {
    this.stop();

    if (!keyframes || keyframes.length === 0) {
      return;
    }

    this.keyframes = keyframes;
    this.currentKeyframeIndex = 0;
    this.startTime = performance.now();
    this.startPosition = this.instance.trackDetails?.position || 0;
    this.totalDuration = keyframes.reduce(
      (sum, kf) => sum + (kf.earlyExit ?? kf.duration),
      0
    );
    this.isActive = true;

    this.instance.isAnimating = true;
    this.instance.emit('animationStarted');

    this.animate();
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.isActive) {
      this.isActive = false;
      this.instance.isAnimating = false;
      this.instance.emit('animationStopped');
    }
  }

  getActive(): boolean {
    return this.isActive;
  }

  private animate = (): void => {
    if (!this.isActive) {
      return;
    }

    const now = performance.now();
    const elapsed = now - this.startTime;

    if (elapsed >= this.totalDuration) {
      // Animation complete
      const finalDistance = this.keyframes.reduce(
        (sum, kf) => sum + kf.distance,
        0
      );
      const finalPosition = this.startPosition + finalDistance;
      this.instance.isAnimating = false;
      this.instance.setPosition(finalPosition);
      this.stop();
      this.instance.emit('animationEnded');
      return;
    }

    // Find current keyframe
    let accumulatedTime = 0;
    let currentKeyframe: AnimationKeyframe | null = null;
    let keyframeStartTime = 0;

    for (let i = 0; i < this.keyframes.length; i++) {
      const kf = this.keyframes[i];
      const duration = kf.earlyExit ?? kf.duration;
      if (elapsed <= accumulatedTime + duration) {
        currentKeyframe = kf;
        keyframeStartTime = accumulatedTime;
        break;
      }
      accumulatedTime += duration;
    }

    if (currentKeyframe) {
      const keyframeElapsed = elapsed - keyframeStartTime;
      const keyframeDuration =
        currentKeyframe.earlyExit ?? currentKeyframe.duration;
      const progress = Math.min(
        keyframeDuration > 0 ? keyframeElapsed / keyframeDuration : 1,
        1
      );

      const easedProgress = currentKeyframe.easing(progress);
      const distance = currentKeyframe.distance * easedProgress;

      // Calculate total distance up to this point
      let totalDistance = distance;
      for (let i = 0; i < this.currentKeyframeIndex; i++) {
        totalDistance += this.keyframes[i].distance;
      }

      this.instance.setPosition(this.startPosition + totalDistance);
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}
