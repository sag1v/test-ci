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

const Slide = ({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) => (
  <div className="slide-content" style={{ backgroundColor: color }}>
    {children}
  </div>
);

// Helper to generate colors
const generateColor = (index: number) => {
  const hue = (index * 20) % 360;
  return `hsl(${hue}, 70%, 80%)`;
};

export const Default: Story = {
  args: {
    children: Array.from({ length: 12 }, (_, i) => (
      <Slide key={i} color={generateColor(i)}>
        <h2>Slide {i + 1}</h2>
        <p>Generated at: {new Date().toISOString()}</p>
      </Slide>
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
      <Slide key={i} color={generateColor(i)}>
        <div className="slide-content">
          <h2>Slide {i + 1}</h2>
          <div className="slide-details">
            <p>Slide ID: {Math.random().toString(36).substring(7)}</p>
            <p>Generated at: {new Date().toISOString()}</p>
          </div>
        </div>
      </Slide>
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

export const ResponsiveCarousel: Story = {
  args: {
    responsive: {
      300: {
        itemsToShow: 1,
        itemsToMove: 1,
        infinite: true,
      },
      800: {
        itemsToShow: 2,
        itemsToMove: 2,
        infinite: true,
      },
      1200: {
        itemsToShow: 4,
      },
    },
    children: Array.from({ length: 10 }, (_, i) => (
      <Slide key={i} color={generateColor(i)}>
        <h2>Slide {i + 1}</h2>
        <p>Resize container to see responsive behavior</p>
      </Slide>
    )),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates responsive behavior based on container width',
      },
    },
  },
};

export const ResizableContainer: Story = {
  render: (args) => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'hidden',
        padding: '20px',
        border: '1px dashed #ccc',
      }}
    >
      <Carousel {...args} />
    </div>
  ),
  args: {
    ...ResponsiveCarousel.args,
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
