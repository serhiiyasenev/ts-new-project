/**
 * Unit tests for TaskCard component
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { TaskCard } from '../../src/components/taskCard/TaskCard';
import type { Task } from '../../src/types/types';

describe('taskCard', () => {
    const mockTask: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'high',
        createdAt: new Date('2024-01-01'),
        deadline: new Date('2024-12-31'),
    };

    const mockOnEdit = vi.fn();
    const mockOnDragStart = vi.fn();

    it('renders task information correctly', () => {
        render(
            <TaskCard 
                task={mockTask} 
                onEdit={mockOnEdit} 
                onDragStart={mockOnDragStart}
            />
        );

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('HIGH')).toBeInTheDocument();
    });

    it('calls onEdit when edit button is clicked', () => {
        render(
            <TaskCard 
                task={mockTask} 
                onEdit={mockOnEdit} 
                onDragStart={mockOnDragStart}
            />
        );

        const editButton = screen.getByRole('button', { name: /edit/i });
        editButton.click();

        expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('displays formatted dates', () => {
        render(
            <TaskCard 
                task={mockTask} 
                onEdit={mockOnEdit} 
                onDragStart={mockOnDragStart}
            />
        );

        expect(screen.getByText(/Created:/)).toBeInTheDocument();
        expect(screen.getByText(/Deadline:/)).toBeInTheDocument();
    });

    it('shows "No deadline" when deadline is null', () => {
        const taskWithoutDeadline = { ...mockTask, deadline: null };
        
        render(
            <TaskCard 
                task={taskWithoutDeadline} 
                onEdit={mockOnEdit} 
                onDragStart={mockOnDragStart}
            />
        );

        expect(screen.queryByText(/Deadline:/)).not.toBeInTheDocument();
    });

    it('has correct priority badge class', () => {
        const { container } = render(
            <TaskCard 
                task={mockTask} 
                onEdit={mockOnEdit} 
                onDragStart={mockOnDragStart}
            />
        );

        const badge = container.querySelector('.priority-high');
        expect(badge).toBeInTheDocument();
    });

    it('is draggable', () => {
        const { container } = render(
            <TaskCard 
                task={mockTask} 
                onEdit={mockOnEdit} 
                onDragStart={mockOnDragStart}
            />
        );

        const card = container.querySelector('.task-card');
        expect(card).toHaveAttribute('draggable', 'true');
    });
});
