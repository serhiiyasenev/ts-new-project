import { Request, Response, NextFunction } from "express";
import { ApiError, sendError } from "@shared/api.types";
import { logger } from "./logger";
import { ZodError } from "zod";

/**
 * Global error handling middleware
 * Catches all errors and returns consistent JSON responses
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // Log the error with context
  logger.error("Request error", {
    errorName: err.name,
    errorMessage: err.message,
    errorStack: err.stack,
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip,
  });

  // Handle ZodError (validation errors from Zod schemas)
  if (err instanceof ZodError) {
    const messages = err.issues.map((issue) => issue.message).join("; ");
    logger.warn("Zod validation error", {
      errors: err.issues,
      path: req.path,
    });
    return sendError(res, messages, 400, { errors: err.issues });
  }

  // Handle ApiError (custom application errors)
  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Handle validation errors from TSOA/Zod
  if (err.name === "ValidateError") {
    logger.warn("Validation error", {
      error: err.message,
      path: req.path,
    });
    return sendError(res, err.message, 400);
  }

  // Handle unexpected errors
  logger.error("Unexpected error", {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  return sendError(res, "Internal server error", 500);
};

/**
 * Async error wrapper for route handlers
 * Catches async errors and passes them to error middleware
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
