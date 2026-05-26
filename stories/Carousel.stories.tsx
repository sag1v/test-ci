import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Carousel, CarouselProps } from '../src/Carousel/Carousel';
import './Carousel.stories.css';

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: {
    onNext: fn(),
    onPrev: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const TimeStamp = () => {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());
  React.useLayoutEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);
  return <div>{`Generated at: ${time}`}</div>;
};

const Slide = ({
  color,
  title,
  details,
}: {
  color: string;
  title: string;
  details: React.ReactNode;
}) => (
  <div className="example-slide-content" style={{ backgroundColor: color }}>
    <h2 className="example-slide-title">{title}</h2>
    <div className="example-slide-details">{details}</div>
  </div>
);

const ResizeContainer = ({
  children,
  direction,
}: {
  children: React.ReactNode;
  direction: 'horizontal' | 'vertical' | 'both';
}) => {
  const arrows = {
    horizontal: '↔',
    vertical: '↕',
    both: '↔↕',
  };

  return (
    <div
      style={{
        resize: direction,
        overflow: 'hidden',
        padding: '20px',
        border: '1px dashed #ccc',
        minWidth: '300px',
        maxWidth: '100%',
        position: 'relative',
      }}
    >
      {children}
      <div className="resizable-hint">{`${arrows[direction]} Drag to resize`}</div>
    </div>
  );
};

// Helper to generate colors
const generateColor = (index: number) => {
  const hue = (index * 20) % 360;
  return `hsl(${hue}, 70%, 80%)`;
};

export const Default: Story = {
  args: {
    children: Array.from({ length: 12 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details={<TimeStamp />}
      />
    )),
  },
};

export const InfiniteScroll: Story = {
  args: {
    ...Default.args,
    infinite: true,
  },
};

export const MultipleSlides: Story = {
  args: {
    infinite: true,
    itemsToShow: 3,
    children: Array.from({ length: 25 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details={<TimeStamp />}
      />
    )),
  },
};

export const MultipleScrolling: Story = {
  args: {
    ...MultipleSlides.args,
    itemsToMove: 3,
  },
};

export const RTLCarousel: Story = {
  args: {
    ...Default.args,
    isRTL: true,
  },
};

export const ResponsiveCarouselHorizontal: Story = {
  render: (args) => (
    <ResizeContainer direction="horizontal">
      <Carousel {...args} />
    </ResizeContainer>
  ),
  args: {
    responsive: {
      300: {
        itemsToShow: 1,
        itemsToMove: 1,
        infinite: true,
      },
      600: {
        itemsToShow: 2,
        itemsToMove: 1,
        infinite: true,
      },
      900: {
        itemsToShow: 3,
        itemsToMove: 1,
      },
      1200: {
        itemsToShow: 4,
        itemsToMove: 2,
      },
    },
    children: Array.from({ length: 10 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details={
          <>
            <p>Resize container horizontally to see responsive behavior</p>
            <p>
              <strong>Breakpoints:</strong> 300px, 600px, 900px, 1200px
            </p>
          </>
        }
      />
    )),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Horizontal carousel with resizable container to demonstrate responsive behavior. Drag the right edge to resize.',
      },
    },
  },
};

export const AutoPlayCarousel: Story = {
  args: {
    ...Default.args,
    enableAutoPlay: true,
    autoPlaySpeed: 3000,
    infinite: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with auto-play enabled, advancing every 3 seconds',
      },
    },
  },
};

export const InitialActiveIndex: Story = {
  args: {
    ...Default.args,
    initialActiveIndex: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Carousel starting at slide 6 (index 5) instead of the first slide',
      },
    },
  },
};

// Create a proper React component for the WithOnChangeCallback story
const OnChangeExample: React.FC<CarouselProps> = (props) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  return (
    <div>
      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
        }}
      >
        <strong>Current Slide:</strong> {currentSlide + 1}
      </div>
      <Carousel
        {...props}
        onChange={(index) => {
          setCurrentSlide(index);
          props.onChange?.(index);
        }}
      />
    </div>
  );
};

export const WithOnChangeCallback: Story = {
  render: (args) => <OnChangeExample {...args} />,
  args: {
    ...Default.args,
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the onChange callback that fires when the active slide changes',
      },
    },
  },
};

export const VerticalCarousel: Story = {
  args: {
    verticalMode: true,
    infinite: true,
    itemsToShow: 2,
    itemsToMove: 1,
    children: Array.from({ length: 8 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details="Vertical scrolling example"
      />
    )),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Carousel in vertical mode, showing multiple slides at a time with vertical alignment',
      },
    },
  },
};

export const ResponsiveCarouselVertical: Story = {
  render: (args) => (
    <ResizeContainer direction="vertical">
      <Carousel {...args} />
    </ResizeContainer>
  ),
  args: {
    verticalMode: true,
    responsive: {
      300: {
        itemsToShow: 1,
        itemsToMove: 1,
        verticalMode: true,
        infinite: true,
      },
      500: {
        itemsToShow: 2,
        itemsToMove: 1,
        verticalMode: true,
        infinite: true,
      },
      700: {
        itemsToShow: 3,
        itemsToMove: 1,
        verticalMode: true,
      },
    },
    children: Array.from({ length: 8 }, (_, i) => (
      <Slide
        key={i}
        title={`Slide ${i + 1}`}
        color={generateColor(i)}
        details={
          <>
            <p>Resize container to see responsive behavior</p>
            <p>
              <strong>Breakpoints:</strong> 300px, 500px, 700px
            </p>
          </>
        }
      />
    )),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Vertical carousel with resizable container to demonstrate responsive behavior. Drag the bottom-right corner to resize both width and height.',
      },
    },
  },
};

export const WithSwipeSupport: Story = {
  name: 'Swipe Support',
  args: {
    children: Array(9)
      .fill(0)
      .map((_, i) => (
        <Slide
          key={`slide-${i}`}
          color={`hsl(${(i * 360) / 5}, 70%, 70%)`}
          title={`Slide ${i + 1}`}
          details={
            <>
              <p>Swipe left or right</p>
              <div className="swipe-indicator">
                <span className="swipe-arrow">←</span>
                <span>Next</span>
                <span className="swipe-arrow" style={{ marginLeft: '20px' }}>
                  →
                </span>
                <span>Previous</span>
              </div>
            </>
          }
        />
      )),
    itemsToShow: 3,
    itemsToMove: 3,
  },
  decorators: [
    (Story) => (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h3>Touch/Mouse Swipe Demo</h3>
          <p>
            This carousel supports touch swipe and mouse drag navigation. Try
            clicking and dragging to navigate between slides.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const VerticalWithSwipeSupport: Story = {
  name: 'Vertical Swipe Support',
  args: {
    children: Array(9)
      .fill(0)
      .map((_, i) => (
        <Slide
          key={`slide-${i}`}
          color={`hsl(${(i * 360) / 5}, 70%, 70%)`}
          title={`Slide ${i + 1}`}
          details={
            <>
              <p>Swipe up or down</p>
              <div className="swipe-indicator vertical">
                <span className="swipe-arrow">↑</span>
                <span>Next</span>
                <span className="swipe-arrow" style={{ marginTop: '20px' }}>
                  ↓
                </span>
                <span>Previous</span>
              </div>
            </>
          }
        />
      )),
    itemsToShow: 3,
    itemsToMove: 3,
    verticalMode: true,
  },
  decorators: [
    (Story) => (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h3>Vertical Touch/Mouse Swipe Demo</h3>
          <p>
            This carousel supports vertical touch swipe and mouse drag
            navigation. Try clicking and dragging up or down to navigate between
            slides.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const PeekedSlidesInfinite: Story = {
  name: 'Peeked Slides (Infinite)',
  args: {
    infinite: true,
    itemsToShow: 1,
    peekSize: 0.5,
    children: Array.from({ length: 10 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details={
          <>
            <p>🔄 Infinite mode with peekSize: 0.5</p>
            <p>Shows 25% peek on BOTH sides (0.5/2 = 0.25)</p>
            <p>All slides have equal peek left & right</p>
          </>
        }
      />
    )),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Infinite mode with peekSize. With peekSize=0.5 and itemsToShow=1, you see 0.25 (25%) of the previous slide on the left, the current slide in full, and 0.25 (25%) of the next slide on the right. The peek is always split evenly on both sides.',
      },
    },
  },
};

export const PeekedSlidesNonInfinite: Story = {
  name: 'Peeked Slides (Non-Infinite)',
  args: {
    infinite: false,
    itemsToShow: 1,
    peekSize: 0.5,
    children: Array.from({ length: 10 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details={
          <>
            <p>📍 Non-infinite mode with peekSize: 0.5</p>
            <p>First slide: 50% peek RIGHT only</p>
            <p>Middle slides: 25% peek on BOTH sides</p>
            <p>Last slide: 50% peek LEFT only</p>
          </>
        }
      />
    )),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Non-infinite mode with peekSize. The first slide shows 0.5 peek only on the right (since there's no content on the left). Middle slides show 0.25 peek on both sides. The last slide shows 0.5 peek only on the left (since there's no content on the right).",
      },
    },
  },
};

export const FreeMode: Story = {
  name: 'Free Mode',
  args: {
    freeMode: true,
    infinite: true,
    itemsToShow: 3,
    itemsToMove: 1,
    children: Array.from({ length: 12 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details={
          <>
            <p>🎯 Free Mode Enabled</p>
            <p>Drag to any position - no snapping!</p>
            <p>The carousel will stop exactly where you release</p>
          </>
        }
      />
    )),
  },
  decorators: [
    (Story) => (
      <div>
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
          }}
        >
          <h3>Free Mode</h3>
          <p>
            In free mode, you can drag the carousel to any position and it will
            stop exactly where you release it. Perfect for scenarios where you
            want precise control over the scrolling position.
          </p>
          <p>
            <strong>Try it:</strong> Click and drag the carousel - you can stop
            at any position!
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Free mode allows continuous dragging without snapping to slides. The carousel stops exactly where you release it, giving you precise control over the position.',
      },
    },
  },
};

export const FreeModeNonInfinite: Story = {
  name: 'Free Mode (Non-Infinite)',
  args: {
    freeMode: true,
    infinite: false,
    itemsToShow: 3,
    itemsToMove: 1,
    children: Array.from({ length: 10 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details={
          <>
            <p>🎯 Free Mode (Non-Infinite)</p>
            <p>Drag freely with boundary constraints</p>
            <p>Movement is limited to the available slides</p>
          </>
        }
      />
    )),
  },
  decorators: [
    (Story) => (
      <div>
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
          }}
        >
          <h3>Free Mode - Non-Infinite</h3>
          <p>
            Free mode with boundary constraints. You can drag freely, but
            movement is limited to the available slides range.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Free mode in non-infinite mode respects the boundaries of the carousel, preventing dragging beyond the first or last slide.',
      },
    },
  },
};

export const FreeSnapMode: Story = {
  name: 'Free Snap Mode',
  args: {
    freeSnapMode: true,
    infinite: true,
    itemsToShow: 3,
    itemsToMove: 1,
    children: Array.from({ length: 12 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details={
          <>
            <p>🎯 Free Snap Mode</p>
            <p>Drag freely, then snap to nearest slide</p>
            <p>Best of both worlds!</p>
          </>
        }
      />
    )),
  },
  decorators: [
    (Story) => (
      <div>
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
          }}
        >
          <h3>Free Snap Mode</h3>
          <p>
            In free snap mode, you can drag the carousel freely to any position,
            but when you release, it will smoothly snap to the nearest slide.
            This combines the freedom of free mode with the precision of
            snapping.
          </p>
          <p>
            <strong>Try it:</strong> Drag the carousel and release - watch it
            snap to the nearest slide!
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Free snap mode allows free dragging but automatically snaps to the nearest slide when released, providing smooth transitions and aligned positioning.',
      },
    },
  },
};

export const FreeSnapModeNonInfinite: Story = {
  name: 'Free Snap Mode (Non-Infinite)',
  args: {
    freeSnapMode: true,
    infinite: false,
    itemsToShow: 3,
    itemsToMove: 1,
    children: Array.from({ length: 10 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details={
          <>
            <p>🎯 Free Snap Mode (Non-Infinite)</p>
            <p>Free drag with boundary snapping</p>
            <p>Snaps to nearest valid slide</p>
          </>
        }
      />
    )),
  },
  decorators: [
    (Story) => (
      <div>
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
          }}
        >
          <h3>Free Snap Mode - Non-Infinite</h3>
          <p>
            Free snap mode with boundary constraints. Drag freely within the
            available range, and it will snap to the nearest valid slide when
            released.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Free snap mode in non-infinite mode respects boundaries while still allowing free dragging and snapping to the nearest slide.',
      },
    },
  },
};

export const FreeModeVertical: Story = {
  name: 'Free Mode (Vertical)',
  args: {
    freeMode: true,
    verticalMode: true,
    infinite: true,
    itemsToShow: 2,
    itemsToMove: 1,
    children: Array.from({ length: 10 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details={
          <>
            <p>🎯 Free Mode (Vertical)</p>
            <p>Swipe up or down freely</p>
            <p>Stop at any vertical position</p>
          </>
        }
      />
    )),
  },
  decorators: [
    (Story) => (
      <div>
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
          }}
        >
          <h3>Free Mode - Vertical</h3>
          <p>
            Free mode works in vertical mode too! Drag vertically to any
            position and release. The carousel will stay exactly where you
            released it.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Free mode in vertical orientation allows free vertical dragging without snapping to slides.',
      },
    },
  },
};

export const FreeSnapModeVertical: Story = {
  name: 'Free Snap Mode (Vertical)',
  args: {
    freeSnapMode: true,
    verticalMode: true,
    infinite: true,
    itemsToShow: 2,
    itemsToMove: 1,
    children: Array.from({ length: 10 }, (_, i) => (
      <Slide
        key={i}
        color={generateColor(i)}
        title={`Slide ${i + 1}`}
        details={
          <>
            <p>🎯 Free Snap Mode (Vertical)</p>
            <p>Drag vertically, snap to nearest slide</p>
            <p>Perfect for vertical browsing</p>
          </>
        }
      />
    )),
  },
  decorators: [
    (Story) => (
      <div>
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
          }}
        >
          <h3>Free Snap Mode - Vertical</h3>
          <p>
            Free snap mode works vertically too! Drag up or down freely, and
            watch it snap to the nearest slide when you release.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Free snap mode in vertical orientation allows free vertical dragging with automatic snapping to the nearest slide.',
      },
    },
  },
};
