export { Carousel } from './Carousel/Carousel';

// Optional: Development warning
if (process.env.NODE_ENV !== 'production') {
  const styleEl = document.querySelector('style[data-vanilla-extract]');
  if (!styleEl) {
    console.warn('Carousel CSS not found. Please import "react-message-component/dist/style.css"');
  }
}
