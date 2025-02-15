import '@testing-library/jest-dom';

// This augments jest's expect
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toBeDisabled(): R;
    }
  }
}
