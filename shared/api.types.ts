export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: number;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class EmailAlreadyExistsError extends ApiError {
  constructor() {
    super("Email already exists", 409);
    this.name = "EmailAlreadyExistsError";
  }
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
  details?: unknown
): ApiErrorResponse {
  const response: ApiErrorResponse = {
    success: false,
    message,
    code,
  };

  if (details !== undefined) {
    response.details = details;
  }

  return response;
}

// Express Response helper functions
// Note: These require Express to be installed in the project using this shared module
export function sendSuccess<T>(res: any, data: T, statusCode = 200): void {
  const response: ApiSuccess<T> = {
    success: true,
    data,
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: any,
  message: string,
  statusCode = 500,
  details?: unknown
): void {
  const response: ApiErrorResponse = {
    success: false,
    message,
    code: statusCode,
  };

  if (details !== undefined) {
    response.details = details;
  }

  res.status(statusCode).json(response);
}
