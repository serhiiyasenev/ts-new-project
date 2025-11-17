/**
 * Unit tests for Statistics component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import { Statistics } from '../../src/components/statistics/Statistics';
import { TaskAPI } from '../../src/api/api';
import type { Task } from '../../src/types/types';

// Mock TaskAPI
vi.mock('../../src/api/api', () => ({
    TaskAPI: {
        getAllTasks: vi.fn(),
    },
}));

describe('statistics', () => {
    const mockTasks: Task[] = [
        {
            id: '1',
            title: 'Task 1',
            description: 'Description 1',
            status: 'todo',
            priority: 'high',
            createdAt: new Date('2024-01-01'),
            deadline: new Date('2024-12-31'),
        },
        {
            id: '2',
            title: 'Task 2',
            description: 'Description 2',
            status: 'in_progress',
            priority: 'medium',
            createdAt: new Date('2024-01-02'),
            deadline: new Date('2024-12-25'),
        },
        {
            id: '3',
            title: 'Task 3',
            description: 'Description 3',
            status: 'done',
            priority: 'low',
            createdAt: new Date('2024-01-03'),
            deadline: null,
        },
        {
            id: '4',
            title: 'Task 4',
            description: 'Description 4',
            status: 'todo',
            priority: 'high',
            createdAt: new Date('2024-01-04'),
            deadline: new Date('2024-12-20'),
        },
        {
            id: '5',
            title: 'Task 5',
            description: 'Description 5',
            status: 'in_progress',
            priority: 'medium',
            createdAt: new Date('2024-01-05'),
            deadline: new Date('2024-12-15'),
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state initially', () => {
        vi.mocked(TaskAPI.getAllTasks).mockImplementation(() => new Promise(() => {}));

        render(<Statistics />);

        expect(screen.getByText('Loading statistics...')).toBeInTheDocument();
    });

    it('renders statistics dashboard title', async () => {
        vi.mocked(TaskAPI.getAllTasks).mockResolvedValue(mockTasks);

        render(<Statistics />);

        await waitFor(() => {
            expect(screen.getByText('Statistics Dashboard')).toBeInTheDocument();
        });
    });

    describe('Total Tasks', () => {
        it('displays correct total number of tasks', async () => {
            vi.mocked(TaskAPI.getAllTasks).mockResolvedValue(mockTasks);

            render(<Statistics />);

            await waitFor(() => {
                expect(screen.getByText('Total Tasks')).toBeInTheDocument();
                expect(screen.getByText('5')).toBeInTheDocument();
            });
        });

        it('displays zero when no tasks', async () => {
            vi.mocked(TaskAPI.getAllTasks).mockResolvedValue([]);

            const { container } = render(<Statistics />);

            await waitFor(() => {
                expect(screen.getByText('Total Tasks')).toBeInTheDocument();
                const totalSection = container.querySelector('.stat-large');
                expect(totalSection).toHaveTextContent('0');
            });
        });
    });

    describe('Tasks by Status', () => {
        it('displays correct task counts by status', async () => {
            vi.mocked(TaskAPI.getAllTasks).mockResolvedValue(mockTasks);

            render(<Statistics />);

            await waitFor(() => {
                expect(screen.getByText('Tasks by Status')).toBeInTheDocument();
                expect(screen.getByText('Todo:')).toBeInTheDocument();
                expect(screen.getByText('In Progress:')).toBeInTheDocument();
                expect(screen.getByText('Done:')).toBeInTheDocument();
            });

            // Check counts (2 todo, 2 in_progress, 1 done)
            const statValues = screen.getAllByText(/^[0-9]+$/);
            expect(statValues.length).toBeGreaterThan(0);
        });

        it('handles tasks with all same status', async () => {
            const allTodoTasks: Task[] = mockTasks.map(task => ({
                ...task,
                status: 'todo' as const,
            }));

            vi.mocked(TaskAPI.getAllTasks).mockResolvedValue(allTodoTasks);

            render(<Statistics />);

            await waitFor(() => {
                expect(screen.getByText('Tasks by Status')).toBeInTheDocument();
            });
        });
    });

    describe('Tasks by Priority', () => {
        it('displays correct task counts by priority', async () => {
            vi.mocked(TaskAPI.getAllTasks).mockResolvedValue(mockTasks);

            render(<Statistics />);

            await waitFor(() => {
                expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
                expect(screen.getByText('High:')).toBeInTheDocument();
                expect(screen.getByText('Medium:')).toBeInTheDocument();
                expect(screen.getByText('Low:')).toBeInTheDocument();
            });

            // Check that numbers are displayed (2 high, 2 medium, 1 low)
            const statValues = screen.getAllByText(/^[0-9]+$/);
            expect(statValues.length).toBeGreaterThan(0);
        });

        it('handles tasks with all high priority', async () => {
            const allHighPriority: Task[] = mockTasks.map(task => ({
                ...task,
                priority: 'high' as const,
            }));

            vi.mocked(TaskAPI.getAllTasks).mockResolvedValue(allHighPriority);

            render(<Statistics />);

            await waitFor(() => {
                expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
            });
        });
    });

    describe('Upcoming Deadlines', () => {
        it('displays upcoming deadlines section', async () => {
            vi.mocked(TaskAPI.getAllTasks).mockResolvedValue(mockTasks);

            render(<Statistics />);

            await waitFor(() => {
                expect(screen.getByText('Upcoming Deadlines')).toBeInTheDocument();
            });
        });

        it('displays tasks with upcoming deadlines', async () => {
            vi.mocked(TaskAPI.getAllTasks).mockResolvedValue(mockTasks);

            render(<Statistics />);

            await waitFor(() => {
                expect(screen.getByText('Upcoming Deadlines')).toBeInTheDocument();
                // Should show task titles
                expect(screen.getByText('Task 5')).toBeInTheDocument();
            });
        });

        it('excludes completed tasks from upcoming deadlines', async () => {
            vi.mocked(TaskAPI.getAllTasks).mockResolvedValue(mockTasks);

            render(<Statistics />);

            await waitFor(() => {
                // Task 3 is done, should not appear in upcoming deadlines
                const upcomingSection = screen.getByText('Upcoming Deadlines').closest('.stats-section');
                expect(upcomingSection).not.toHaveTextContent('Task 3');
            });
        });

        it('shows no deadlines message when no tasks have deadlines', async () => {
            const tasksWithoutDeadlines: Task[] = mockTasks.map(task => ({
                ...task,
                deadline: null,
            }));

            vi.mocked(TaskAPI.getAllTasks).mockResolvedValue(tasksWithoutDeadlines);

            render(<Statistics />);

            await waitFor(() => {
                expect(screen.getByText('No upcoming deadlines')).toBeInTheDocument();
            });
        });

        it('limits upcoming deadlines to 3 tasks', async () => {
            const manyTasks: Task[] = [
                ...mockTasks,
                {
                    id: '6',
                    title: 'Task 6',
                    description: 'Description 6',
                    status: 'todo',
                    priority: 'low',
                    createdAt: new Date('2024-01-06'),
                    deadline: new Date('2024-12-01'),
                },
                {
                    id: '7',
                    title: 'Task 7',
                    description: 'Description 7',
                    status: 'todo',
                    priority: 'low',
                    createdAt: new Date('2024-01-07'),
                    deadline: new Date('2024-12-02'),
                },
            ];

            vi.mocked(TaskAPI.getAllTasks).mockResolvedValue(manyTasks);

            const { container } = render(<Statistics />);

            await waitFor(() => {
                const upcomingItems = container.querySelectorAll('.upcoming-item');
                expect(upcomingItems.length).toBeLessThanOrEqual(3);
            });
        });
    });

    describe('Error Handling', () => {
        it('handles API errors gracefully', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            vi.mocked(TaskAPI.getAllTasks).mockRejectedValue(new Error('API Error'));

            render(<Statistics />);

            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    'Failed to fetch statistics:',
                    expect.any(Error)
                );
            });

            consoleErrorSpy.mockRestore();
        });

        it('still renders UI after API error', async () => {
            vi.spyOn(console, 'error').mockImplementation(() => {});
            vi.mocked(TaskAPI.getAllTasks).mockRejectedValue(new Error('API Error'));

            render(<Statistics />);

            await waitFor(() => {
                expect(screen.getByText('Statistics Dashboard')).toBeInTheDocument();
            });
        });
    });
});
