export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
    deadline?: string | null;
}