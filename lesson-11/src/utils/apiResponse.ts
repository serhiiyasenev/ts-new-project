import { Response } from "express";
import { ApiSuccess, ApiError } from "../../shared/api.types";

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  const response: ApiSuccess<T> = {
    success: true,
    data,
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  details?: unknown,
): void {
  const response: ApiError = {
    success: false,
    message,
    code: statusCode,
  };

  if (details !== undefined) {
    response.details = details;
  }

  res.status(statusCode).json(response);
}

export function createSuccessResponse<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data,
  };
}

export function createErrorResponse(
  message: string,
  code: number,
  details?: unknown,
): ApiError {
  const response: ApiError = {
    success: false,
    message,
    code,
  };

  if (details !== undefined) {
    response.details = details;
  }

  return response;
}
