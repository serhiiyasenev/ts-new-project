import { z } from "zod";

// Helper to create numeric ID schema with custom error messages
export const createPositiveNumericIdSchema = (name: string) =>
  z.string()
    .min(1, { message: `Missing ${name} id` })
    .regex(/^[1-9]\d*$/, { message: `${name} ID must be a positive integer` });