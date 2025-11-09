import { describe, it, expect } from 'vitest';
import { setupTestDom } from './helpers';

describe('Helpers Tests', () => {
  it('setupTestDom should render minimal DOM correctly', () => {
    setupTestDom();
    expect(document.querySelector('#taskForm')).not.toBeNull();
    expect(document.querySelector('#upcomingDeadlines')).not.toBeNull();
  });
});
