// dto/task.ts
import { z } from 'zod';
import { Status } from './dto/status'
import { Priority } from './dto/priority'

export const StatusSchema = z.enum(Status);
export const PrioritySchema = z.enum(Priority);

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    createdAt: z.preprocess(
        (val) => (typeof val === 'string' || val instanceof Date ? new Date(val) : val),
        z.date()
    ),
    status: StatusSchema,
    priority: PrioritySchema,
    deadline: z.preprocess(
        (val) => (typeof val === 'string' || val instanceof Date ? new Date(val) : val),
        z.date()
    )
});


export type Task = z.infer<typeof TaskSchema>;
