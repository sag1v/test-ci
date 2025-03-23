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
