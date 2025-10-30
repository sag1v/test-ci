import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Carousel } from '../src/Carousel/Carousel';
import './Carousel.stories.css';

const showcaseMeta: Meta<typeof Carousel> = {
  title: 'Showcase/Movie Streaming Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: {
    onNext: fn(),
    onPrev: fn(),
  },
};

export default showcaseMeta;
type ShowcaseStory = StoryObj<typeof Carousel>;

// Movie/show content data
const streamingContent = [
  {
    title: 'Stranger Things',
    year: '2016',
    genre: 'Sci-Fi • Horror',
    rating: '9.2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    title: 'The Crown',
    year: '2016',
    genre: 'Drama • Historical',
    rating: '8.7',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    title: 'Dark',
    year: '2017',
    genre: 'Sci-Fi • Thriller',
    rating: '8.8',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    title: 'Money Heist',
    year: '2017',
    genre: 'Crime • Thriller',
    rating: '8.3',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    title: 'The Witcher',
    year: '2019',
    genre: 'Fantasy • Action',
    rating: '8.2',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    title: 'Bridgerton',
    year: '2020',
    genre: 'Drama • Romance',
    rating: '7.4',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  {
    title: 'Squid Game',
    year: '2021',
    genre: 'Thriller • Drama',
    rating: '8.0',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
  {
    title: 'Wednesday',
    year: '2022',
    genre: 'Comedy • Mystery',
    rating: '8.1',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
  {
    title: 'House of Cards',
    year: '2013',
    genre: 'Drama • Political',
    rating: '8.7',
    gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
  },
  {
    title: 'Black Mirror',
    year: '2011',
    genre: 'Sci-Fi • Anthology',
    rating: '8.8',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  },
  {
    title: "The Queen's Gambit",
    year: '2020',
    genre: 'Drama • Sports',
    rating: '8.6',
    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
  },
  {
    title: 'Narcos',
    year: '2015',
    genre: 'Crime • Drama',
    rating: '8.8',
    gradient: 'linear-gradient(135deg, #fad961 0%, #f76b1c 100%)',
  },
  {
    title: 'Orange is the New Black',
    year: '2013',
    genre: 'Comedy • Drama',
    rating: '8.1',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
  },
  {
    title: 'Ozark',
    year: '2017',
    genre: 'Crime • Drama',
    rating: '8.5',
    gradient: 'linear-gradient(135deg, #3494e6 0%, #ec6ead 100%)',
  },
  {
    title: 'The Last Kingdom',
    year: '2015',
    genre: 'Action • Drama',
    rating: '8.5',
    gradient: 'linear-gradient(135deg, #c79081 0%, #dfa579 100%)',
  },
];

const MovieSlide = ({
  title,
  year,
  genre,
  rating,
  gradient,
}: {
  title: string;
  year: string;
  genre: string;
  rating: string;
  gradient: string;
}) => (
  <div className="netflix-slide">
    <div className="netflix-slide-poster" style={{ background: gradient }}>
      <div className="netflix-slide-overlay">
        <div className="netflix-slide-content">
          <div className="netflix-slide-rating">
            <span className="netflix-rating-icon">★</span>
            <span>{rating}</span>
          </div>
          <h3 className="netflix-slide-title">{title}</h3>
          <div className="netflix-slide-meta">
            <span className="netflix-year">{year}</span>
            <span className="netflix-separator">•</span>
            <span className="netflix-genre">{genre}</span>
          </div>
          <div className="netflix-slide-play-button">
            <span>▶</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const MovieStreamingShowcase: ShowcaseStory = {
  name: 'Movie & TV Show Browser',
  args: {
    infinite: true,
    itemsToShow: 5,
    itemsToMove: 2,
    children: streamingContent.map((item, i) => (
      <MovieSlide key={i} {...item} />
    )),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: '#141414',
          padding: '60px 40px',
          borderRadius: '8px',
          minHeight: '450px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'A movie streaming service carousel showcasing movies and TV shows with beautiful thumbnails, hover effects, and smooth navigation. Perfect for media browsing applications.',
      },
    },
  },
};

export const AutoPlayingStreamingCarousel: ShowcaseStory = {
  name: 'Auto-Playing Content Carousel',
  args: {
    infinite: true,
    itemsToShow: 5,
    itemsToMove: 2,
    enableAutoPlay: true,
    autoPlaySpeed: 4000,
    children: streamingContent.map((item, i) => (
      <MovieSlide key={i} {...item} />
    )),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: '#141414',
          padding: '60px 40px',
          borderRadius: '8px',
          minHeight: '450px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Movie streaming carousel with auto-play functionality. Automatically advances through content while maintaining user interaction capabilities.',
      },
    },
  },
};

export const StreamingHomepageLayout: ShowcaseStory = {
  name: 'Streaming Service Homepage',
  render: () => (
    <div style={{ backgroundColor: '#141414', padding: '40px 20px' }}>
      <div style={{ marginBottom: '60px' }}>
        <h2
          style={{
            color: '#fff',
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            paddingLeft: '20px',
          }}
        >
          Trending Now
        </h2>
        <Carousel infinite={true} itemsToShow={5} itemsToMove={2}>
          {streamingContent.slice(0, 10).map((item, i) => (
            <MovieSlide key={i} {...item} />
          ))}
        </Carousel>
      </div>
      <div style={{ marginBottom: '60px' }}>
        <h2
          style={{
            color: '#fff',
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            paddingLeft: '20px',
          }}
        >
          Popular This Week
        </h2>
        <Carousel infinite={true} itemsToShow={5} itemsToMove={2}>
          {streamingContent.slice(5, 15).map((item, i) => (
            <MovieSlide key={i} {...item} />
          ))}
        </Carousel>
      </div>
      <div>
        <h2
          style={{
            color: '#fff',
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            paddingLeft: '20px',
          }}
        >
          Top Picks for You
        </h2>
        <Carousel infinite={true} itemsToShow={5} itemsToMove={2}>
          {streamingContent.slice(10, 15).map((item, i) => (
            <MovieSlide key={i} {...item} />
          ))}
        </Carousel>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple carousel rows showcasing different content categories, similar to a streaming service homepage layout.',
      },
    },
  },
};
