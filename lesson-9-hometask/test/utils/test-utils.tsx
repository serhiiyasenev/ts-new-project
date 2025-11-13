/**
 * Custom test utilities for React Testing Library
 */
import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

/**
 * Custom render function that wraps components with providers if needed
 */
function customRender(ui: ReactElement, options?: RenderOptions) {
    return rtlRender(ui, { ...options });
}

// Re-export everything from React Testing Library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
// Override render with custom implementation
export { customRender as render };
