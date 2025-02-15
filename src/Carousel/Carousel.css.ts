import { style } from '@vanilla-extract/css';

export const root = style({
  position: 'relative',
  overflow: 'hidden',
});

export const track = style({
  display: 'flex',
  position: 'relative',
  width: '100%',
  height: '100%',
  willChange: 'transform',
});

export const slide = style({
  flex: '0 0 auto',
  width: '100%',
  height: '100%',
});

const arrowBase = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
  padding: '8px 16px',
  background: 'rgba(255, 255, 255, 0.8)',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const prevArrow = style([
  arrowBase,
  {
    left: '10px',
  },
]);

export const nextArrow = style([
  arrowBase,
  {
    right: '10px',
  },
]);

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
