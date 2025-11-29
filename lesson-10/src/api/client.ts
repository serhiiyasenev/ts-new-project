/**
 * Base API Client
 * Provides type-safe HTTP methods with standardized error handling
 */

import { ApiSuccess, ApiError } from "@shared/api.types";

const API_BASE = "/api";

/**
 * Custom API Error class
 */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

/**
 * Handle API response and extract data
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    if (isJson) {
      const errorData = (await response.json()) as ApiError;
      throw new ApiRequestError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.details
      );
    }
    throw new ApiRequestError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }

  if (!isJson) {
    throw new ApiRequestError("Expected JSON response", response.status);
  }

  const jsonData = await response.json();

  // Handle standardized API response format
  if (
    typeof jsonData === "object" &&
    jsonData !== null &&
    "success" in jsonData
  ) {
    const apiResponse = jsonData as ApiSuccess<T> | ApiError;
    if (apiResponse.success) {
      return apiResponse.data;
    } else {
      throw new ApiRequestError(
        apiResponse.message,
        apiResponse.code,
        apiResponse.details
      );
    }
  }

  // Fallback for non-standardized responses
  return jsonData as T;
}

/**
 * GET request
 */
export async function get<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString());
  return handleResponse<T>(response);
}

/**
 * POST request
 */
export async function post<T, D = unknown>(
  endpoint: string,
  data?: D
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
  return handleResponse<T>(response);
}

/**
 * PUT request
 */
export async function put<T, D = unknown>(
  endpoint: string,
  data: D
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

/**
 * DELETE request
 */
export async function del<T = void>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
  });
  return handleResponse<T>(response);
}
