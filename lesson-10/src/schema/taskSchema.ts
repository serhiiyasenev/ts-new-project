import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  dueDate: z.string().nonempty("Due date is required").refine((date) => {
    const dueDate = new Date(date);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return dueDate >= today;
  }, { message: "Due date must be today or in the future" }),
});

export type TaskFormFields = z.infer<typeof taskSchema>;
