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

// Style for faster snap animations (used in free snap mode and edge cases)
export const trackSnapping = style({
  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important', // Faster snap animation
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
  padding: '0',
  width: '48px',
  height: '48px',
  minWidth: '48px',
  minHeight: '48px',
  background: 'rgba(255, 255, 255, 0.95)',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: '600',
  color: '#333',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',

  ':hover': {
    background: '#fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1.1)',
    color: '#000',
  },

  ':active': {
    transform: 'scale(0.95)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  },

  ':disabled': {
    opacity: 0.35,
    cursor: 'not-allowed',
    transform: 'none',
    background: 'rgba(255, 255, 255, 0.5)',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },

  selectors: {
    '&:disabled:hover': {
      transform: 'none',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    },
  },

  '@media': {
    '(max-width: 768px)': {
      width: '40px',
      height: '40px',
      minWidth: '40px',
      minHeight: '40px',
      fontSize: '18px',
    },
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
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
