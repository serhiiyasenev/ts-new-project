import { ZodError, ZodSchema, z } from "zod";
import { ApiError } from "../types/errors";

const formatZodError = (error: ZodError) =>
  error.issues.map((issue) => issue.message).join("; ");

export const validateWithSchema = <T>(
  schema: ZodSchema<T>,
  payload: unknown,
  contextMessage: string
): T => {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(`${contextMessage}: ${formatZodError(parsed.error)}`, 400);
  }
  return parsed.data;
};

export const validateNumericId = (value: unknown, label: string): number => {
  const parsed = z.coerce.number().int().positive().safeParse(value);
  if (!parsed.success) {
    throw new ApiError(`${label} must be a positive integer`, 400);
  }
  return parsed.data;
};

