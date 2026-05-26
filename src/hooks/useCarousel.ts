import { useCallback, useEffect, useRef, useState } from 'react';
import { CarouselCore } from '../core/carouselCore';
import { CarouselCoreOptions, CarouselCorePlugin } from '../core/types';
import { createFreeModePlugin } from '../core/freeModePlugin';

export interface UseCarouselOptions extends CarouselCoreOptions {
  // Additional React-specific options can go here
}

export interface UseCarouselReturn {
  containerRef: (node: HTMLElement | null) => void;
  trackRef: (node: HTMLElement | null) => void;
  instanceRef: React.MutableRefObject<CarouselCore | null>;
  currentIndex: number;
  totalItems: number;
}

export function useCarousel(
  options: UseCarouselOptions = {},
  plugins: CarouselCorePlugin[] = []
): UseCarouselReturn {
  const containerRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLElement | null>(null);
  const instanceRef = useRef<CarouselCore | null>(null);
  const [currentIndex, setCurrentIndex] = useState(
    options.initialActiveIndex || 0
  );
  const [totalItems, setTotalItems] = useState(0);

  // Create plugins array with free mode plugin if needed
  const allPlugins = [
    ...(options.freeMode || options.freeSnapMode
      ? [createFreeModePlugin()]
      : []),
    ...plugins,
  ];

  const setContainerRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;
  }, []);

  const setTrackRef = useCallback((node: HTMLElement | null) => {
    trackRef.current = node;
  }, []);

  // Initialize carousel when both refs are available
  useEffect(() => {
    if (!containerRef.current || !trackRef.current) {
      return;
    }

    // Create carousel instance
    const instance = new CarouselCore(
      containerRef.current,
      trackRef.current,
      options,
      allPlugins
    );

    instanceRef.current = instance;

    // Listen to index changes
    const handleIndexChanged = (data?: unknown) => {
      const payload = data as
        | { oldIndex: number; newIndex: number }
        | undefined;
      if (!payload) {
        return;
      }
      setCurrentIndex(payload.newIndex);
      options.onChange?.(payload.newIndex);
    };

    instance.on('indexChanged', handleIndexChanged);

    // Listen to updates
    const handleUpdated = () => {
      if (instance.trackDetails) {
        setCurrentIndex(instance.trackDetails.currentIndex);
        setTotalItems(instance.trackDetails.totalItems);
      }
    };

    instance.on('updated', handleUpdated);
    instance.on('created', handleUpdated);

    return () => {
      instance.off('indexChanged', handleIndexChanged);
      instance.off('updated', handleUpdated);
      instance.off('created', handleUpdated);
      instance.destroy();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- instance is created once; options sync via separate effect
  }, []);

  // Update options when they change
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update(options);
    }
  }, [options]);

  return {
    containerRef: setContainerRef,
    trackRef: setTrackRef,
    instanceRef,
    currentIndex,
    totalItems,
  };
}
