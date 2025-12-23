// Jest setup file
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/font
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
}));

// Suppress console errors in tests unless needed
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
