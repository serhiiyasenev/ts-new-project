import { useEffect, useState } from 'react';
import { TaskAPI } from '../../api/api';
import type { Task } from '../../types/types';
import './Statistics.css';

interface StatisticsProps {
    refreshTrigger?: number;
}

export const Statistics = ({ refreshTrigger }: StatisticsProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const fetchedTasks = await TaskAPI.getAllTasks();
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Failed to fetch statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [refreshTrigger]);

    if (loading) {
        return <div className="statistics-container">Loading statistics...</div>;
    }

    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const doneTasks = tasks.filter(t => t.status === 'done').length;

    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;

    // Get upcoming deadlines (next 3 tasks with deadlines, not done, sorted by deadline)
    const upcomingTasks = tasks
        .filter(t => t.deadline && t.status !== 'done')
        .sort((a, b) => {
            const dateA = new Date(a.deadline!).getTime();
            const dateB = new Date(b.deadline!).getTime();
            return dateA - dateB;
        })
        .slice(0, 3)
        .map(t => ({
            title: t.title,
            deadline: new Date(t.deadline!).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            })
        }));

    return (
        <div className="statistics-container">
            <h2>Statistics Dashboard</h2>
            
            <div className="stats-sections">
                {/* Total Tasks Section */}
                <div className="stats-section">
                    <h3>Total Tasks</h3>
                    <div className="stat-large">{totalTasks}</div>
                </div>

                {/* Tasks by Status Section */}
                <div className="stats-section">
                    <h3>Tasks by Status</h3>
                    <div className="stat-list">
                        <div className="stat-row">
                            <span className="stat-label">Todo:</span>
                            <span className="stat-value">{todoTasks}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">In Progress:</span>
                            <span className="stat-value">{inProgressTasks}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Done:</span>
                            <span className="stat-value">{doneTasks}</span>
                        </div>
                    </div>
                </div>

                {/* Tasks by Priority Section */}
                <div className="stats-section">
                    <h3>Tasks by Priority</h3>
                    <div className="stat-list">
                        <div className="stat-row">
                            <span className="stat-label">High:</span>
                            <span className="stat-value">{highPriority}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Medium:</span>
                            <span className="stat-value">{mediumPriority}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Low:</span>
                            <span className="stat-value">{lowPriority}</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Deadlines Section */}
                <div className="stats-section">
                    <h3>Upcoming Deadlines</h3>
                    <div className="upcoming-list">
                        {upcomingTasks.length > 0 ? (
                            upcomingTasks.map((task, index) => (
                                <div key={index} className="upcoming-item">
                                    <span className="upcoming-title">{task.title}</span>
                                    <span className="upcoming-date">{task.deadline}</span>
                                </div>
                            ))
                        ) : (
                            <div className="no-deadlines">No upcoming deadlines</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
