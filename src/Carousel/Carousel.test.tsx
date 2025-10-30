import React from 'react';
import { render } from '@testing-library/react';
import { Carousel } from './Carousel';

describe('Carousel Smoke Test', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <Carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Carousel>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render with minimal props', () => {
    const { container } = render(
      <Carousel itemsToShow={1}>
        <div>Slide 1</div>
      </Carousel>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render with multiple children', () => {
    const { container } = render(
      <Carousel itemsToShow={2}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
      </Carousel>
    );

    expect(container).toBeInTheDocument();
  });
});
