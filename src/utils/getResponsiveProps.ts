import { CarouselProps, CarouselResponsiveProps } from '../types';

export const getResponsiveProps = (
  defaultProps: Omit<CarouselProps, 'children' | 'responsive'>,
  responsive: Record<number, CarouselResponsiveProps> | undefined,
  containerWidth: number
): CarouselResponsiveProps => {
  if (!responsive || containerWidth === 0) {
    return defaultProps;
  }

  const breakpoints = Object.keys(responsive)
    .map(Number)
    .sort((a, b) => b - a);
  
  const activeBreakpoint = breakpoints.find(
    (breakpoint) => containerWidth >= breakpoint
  );
  
  if (!activeBreakpoint) {
    return defaultProps;
  }

  return {
    ...defaultProps,
    ...responsive[activeBreakpoint]
  };
};
