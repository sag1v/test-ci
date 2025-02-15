import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel } from '../../src/Carousel/Carousel';
import * as styles from '../../src/Carousel/Carousel.css';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Carousel Component', () => {
  const createSlides = (count: number) =>
    Array.from({ length: count }, (_, i) => <div key={i}>Slide {i + 1}</div>);

  it('renders all slides', () => {
    render(<Carousel>{createSlides(3)}</Carousel>);
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
  });

  it('handles empty children', () => {
    // Empty children should still render the carousel structure
    const { container } = render(<Carousel>{[]}</Carousel>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('handles no children', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
      // Empty implementation to silence the warning
    });

    // @ts-expect-error - Testing invalid prop type for runtime behavior check
    const { container } = render(<Carousel />);
    expect(container.firstChild).toBeNull();
    consoleSpy.mockRestore();
  });

  it('navigates to next slide when clicking next arrow', async () => {
    const user = userEvent.setup();
    render(<Carousel>{createSlides(3)}</Carousel>);

    const nextButton = screen.getByRole('button', { name: '→' });
    await act(async () => {
      await user.click(nextButton);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 300)));

    expect(screen.getByText('Slide 2')).toBeVisible();
  });

  it('navigates to previous slide when clicking previous arrow', async () => {
    const user = userEvent.setup();
    render(<Carousel initialActiveIndex={1}>{createSlides(3)}</Carousel>);

    const prevButton = screen.getByRole('button', { name: '←' });
    await act(async () => {
      await user.click(prevButton);
    });

    await act(() => new Promise((resolve) => setTimeout(resolve, 300)));

    expect(screen.getByText('Slide 1')).toBeVisible();
  });

  it('disables arrows at boundaries when infinite scroll is off', () => {
    render(<Carousel infinite={false}>{createSlides(3)}</Carousel>);

    const prevButton = screen.getByRole('button', { name: '←' });
    const nextButton = screen.getByRole('button', { name: '→' });

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onNext/onPrev when navigating', async () => {
    const onNext = jest.fn();
    const onPrev = jest.fn();
    const user = userEvent.setup();

    render(
      <Carousel infinite onNext={onNext} onPrev={onPrev}>
        {createSlides(3)}
      </Carousel>
    );

    const nextButton = screen.getByRole('button', { name: '→' });
    const prevButton = screen.getByRole('button', { name: '←' });
    const track = screen.getByText('Slide 1').parentElement!;

    // Click next and verify
    await act(async () => {
      await user.click(nextButton);
    });
    expect(onNext).toHaveBeenCalled();

    // Wait for animation to complete
    await act(async () => {
      fireEvent.transitionEnd(track);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Click prev and verify
    await act(async () => {
      await user.click(prevButton);
    });
    expect(onPrev).toHaveBeenCalled();
  });

  it('supports touch swipe navigation', () => {
    render(<Carousel>{createSlides(3)}</Carousel>);
    const track = screen.getByText('Slide 1').parentElement!;

    // Simulate swipe left
    fireEvent.touchStart(track, { touches: [{ clientX: 500 }] });
    fireEvent.touchMove(track, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(track);

    expect(screen.getByText('Slide 2')).toBeVisible();
  });

  it('auto-plays when enabled', () => {
    jest.useFakeTimers();

    render(
      <Carousel enableAutoPlay autoPlaySpeed={1000}>
        {createSlides(3)}
      </Carousel>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Slide 2')).toBeVisible();

    jest.useRealTimers();
  });

  it('pauses auto-play on hover', () => {
    jest.useFakeTimers();

    render(
      <Carousel enableAutoPlay autoPlaySpeed={1000}>
        {createSlides(3)}
      </Carousel>
    );

    const carousel = screen.getByText('Slide 1').parentElement!.parentElement!;

    fireEvent.mouseEnter(carousel);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should still be on first slide
    expect(screen.getByText('Slide 1')).toBeVisible();

    jest.useRealTimers();
  });
});

describe('Responsive behavior', () => {
  const mockResizeObserver = jest.fn();
  let triggerResize: (width: number) => void;

  const createSlides = (count: number) =>
    Array.from({ length: count }, (_, i) => <div key={i}>Slide {i + 1}</div>);

  beforeEach(() => {
    mockResizeObserver.mockReset();

    triggerResize = (width: number) => {
      const callback = mockResizeObserver.mock.calls[0][0];

      callback([
        {
          target: {
            classList: { contains: (name: string) => name === styles.root },
          },
          contentRect: { width, height: 100 },
        } as ResizeObserverEntry,
      ]);
    };

    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        mockResizeObserver(callback);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('uses default props when no responsive config provided', async () => {
    render(<Carousel itemsToShow={2}>{createSlides(5)}</Carousel>);

    await act(async () => {
      triggerResize(1000);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(screen.getAllByText(/Slide/)).toHaveLength(3);
  });

  it('selects correct breakpoint based on container width', async () => {
    render(
      <Carousel
        responsive={{
          300: { itemsToShow: 1 },
          800: { itemsToShow: 2 },
          1200: { itemsToShow: 4 },
        }}
        infinite
      >
        {createSlides(8)}
      </Carousel>
    );

    await act(async () => {
      triggerResize(1300);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(screen.getAllByText(/Slide/)).toHaveLength(6); // 1 prev + 4 visible + 1 next
  });

  it('falls back to defaults when width is below smallest breakpoint', async () => {
    render(
      <Carousel
        itemsToShow={1}
        responsive={{
          800: { itemsToShow: 2 },
        }}
      >
        {createSlides(4)}
      </Carousel>
    );

    await act(async () => {
      triggerResize(500);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(screen.getAllByText(/Slide/)).toHaveLength(2);
  });
});
