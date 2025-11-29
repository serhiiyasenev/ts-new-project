export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  code: number;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
