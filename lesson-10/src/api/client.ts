import { ApiSuccess, ApiErrorResponse } from "@shared/api.types";

const API_BASE = "/api";

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

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    if (isJson) {
      const errorData = (await response.json()) as ApiErrorResponse;
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

  if (
    typeof jsonData === "object" &&
    jsonData !== null &&
    "success" in jsonData
  ) {
    const apiResponse = jsonData as ApiSuccess<T> | ApiErrorResponse;
    if (apiResponse.success === true) {
      return apiResponse.data;
    } else {
      throw new ApiRequestError(
        apiResponse.message,
        apiResponse.code,
        apiResponse.details
      );
    }
  }

  return jsonData as T;
}

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

export async function del<T = void>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "DELETE",
  });
  return handleResponse<T>(response);
}
