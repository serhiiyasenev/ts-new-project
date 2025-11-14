/**
 * Task form validation schema using Zod
 * Validates all task form fields with custom rules
 */
import { z } from 'zod';

// Get today's date at midnight for comparison
const getTodayMidnight = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

export const taskFormSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(100, 'Title must be less than 100 characters'),
    
    description: z.string()
        .min(1, 'Description is required')
        .max(500, 'Description must be less than 500 characters'),
    
    status: z.enum(['todo', 'in_progress', 'done'], {
        message: 'Status is required',
    }),
    
    priority: z.enum(['low', 'medium', 'high'], {
        message: 'Priority is required',
    }),
    
    deadline: z.string()
        .optional()
        .refine((value) => {
            if (!value) return true; // Optional field
            const selectedDate = new Date(value);
            selectedDate.setHours(0, 0, 0, 0);
            return selectedDate >= getTodayMidnight();
        }, {
            message: 'Deadline cannot be in the past',
        }),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
