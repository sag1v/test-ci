import { style } from '@vanilla-extract/css';

export const root = style({
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px', // Space between buttons and frame
});

export const frame = style({
  position: 'relative',
  flex: '1 1 auto',
  overflow: 'hidden', // Hide overflow within the frame
  width: '100%',
  minHeight: '1px',
  display: 'flex',
  cursor: 'grab', // Default grabbing cursor
});

export const dragging = style({
  cursor: 'grabbing', // When actively dragging
  userSelect: 'none', // Prevent text selection during drag
});

// Style that adds visual feedback when dragging
export const trackDragging = style({
  transition: 'none !important', // Ensure no transition during drag
  // Add a subtle shadow effect to indicate drag
  filter: 'drop-shadow(0 0 8px rgba(0, 100, 255, 0.3))',
});

// Style for animated track transitions
export const trackAnimating = style({
  transition: 'transform 0.4s ease-out !important', // Smooth, slightly faster than before
});

export const track = style({
  display: 'flex',
  position: 'relative',
  width: '100%',
  height: '100%', // Ensure track takes full height
  willChange: 'transform',
});

// Vertical track style
export const trackVertical = style({
  flexDirection: 'column', // Stack slides vertically
});

export const slide = style({
  flex: '0 0 auto',
  width: '100%',
  boxSizing: 'border-box',
});

const arrowBase = style({
  flexShrink: 0, // Prevent buttons from shrinking
  padding: '8px 16px',
  background: 'rgba(255, 255, 255, 0.8)',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  zIndex: 1,

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const prevArrow = style([arrowBase]);

export const nextArrow = style([arrowBase]);

export const pagination = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  marginTop: '16px',
});

export const paginationDot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#ccc',
  cursor: 'pointer',
  border: 'none',
  padding: 0,

  selectors: {
    '&[data-active="true"]': {
      backgroundColor: '#333',
    },
  },
});
