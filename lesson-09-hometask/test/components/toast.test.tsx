/**
 * Unit tests for Toast component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { Toast } from '../../src/components/toast/Toast';

describe('toast', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders success toast with correct styling', () => {
        const { container } = render(
            <Toast 
                message="Success message" 
                type="success" 
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Success message')).toBeInTheDocument();
        expect(container.querySelector('.toast-success')).toBeInTheDocument();
        expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('renders error toast with correct styling', () => {
        const { container } = render(
            <Toast 
                message="Error message" 
                type="error" 
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(container.querySelector('.toast-error')).toBeInTheDocument();
        expect(screen.getAllByText('✕')[0]).toBeInTheDocument();
    });

    it('renders info toast with correct styling', () => {
        const { container } = render(
            <Toast 
                message="Info message" 
                type="info" 
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Info message')).toBeInTheDocument();
        expect(container.querySelector('.toast-info')).toBeInTheDocument();
        expect(screen.getByText('ℹ')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(
            <Toast 
                message="Test message" 
                type="success" 
                onClose={mockOnClose}
            />
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        closeButton.click();

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('auto-closes after default duration', async () => {
        vi.useFakeTimers();
        
        render(
            <Toast 
                message="Test message" 
                type="success" 
                onClose={mockOnClose}
            />
        );

        expect(mockOnClose).not.toHaveBeenCalled();

        // Fast-forward time
        await vi.advanceTimersByTimeAsync(3000);

        expect(mockOnClose).toHaveBeenCalledTimes(1);

        vi.useRealTimers();
    });

    it('auto-closes after custom duration', async () => {
        vi.useFakeTimers();
        
        render(
            <Toast 
                message="Test message" 
                type="success" 
                onClose={mockOnClose}
                duration={5000}
            />
        );

        await vi.advanceTimersByTimeAsync(4999);
        expect(mockOnClose).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(1);
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);

        vi.useRealTimers();
    });
});
