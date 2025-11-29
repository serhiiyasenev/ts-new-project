import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../src/helpers/errorHandler";
import { ApiError } from "../../src/types/errors";
import { ZodError, z } from "zod";

describe("errorHandler", () => {
  const mockRequest = (overrides = {}) =>
    ({
      method: "GET",
      path: "/test",
      query: {},
      body: {},
      ip: "127.0.0.1",
      ...overrides,
    }) as Request;

  const mockResponse = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = vi.fn() as NextFunction;

  it("handles ApiError correctly", () => {
    const req = mockRequest();
    const res = mockResponse();
    const error = new ApiError("Test error", 404);

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Test error",
      code: 404,
    });
  });

  it("handles ZodError correctly", () => {
    const req = mockRequest();
    const res = mockResponse();
    const schema = z.object({ name: z.string() });
    let error: ZodError;

    try {
      schema.parse({});
    } catch (e) {
      error = e as ZodError;
    }

    errorHandler(error!, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  it("handles ValidateError correctly", () => {
    const req = mockRequest();
    const res = mockResponse();
    const error = new Error("Validation failed");
    error.name = "ValidateError";

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      code: 400,
    });
  });

  it("handles unexpected errors", () => {
    const req = mockRequest();
    const res = mockResponse();
    const error = new Error("Unexpected error");

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
      code: 500,
    });
  });
});

describe("asyncHandler", () => {
  it("wraps async function and catches errors", async () => {
    const { asyncHandler } = await import("../../src/helpers/errorHandler");
    const mockNext = vi.fn();
    const mockReq = {} as Request;
    const mockRes = {} as Response;

    const asyncFn = async () => {
      throw new Error("Async error");
    };

    const wrapped = asyncHandler(asyncFn);
    await wrapped(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it("handles successful async function", async () => {
    const { asyncHandler } = await import("../../src/helpers/errorHandler");
    const mockNext = vi.fn();
    const mockReq = {} as Request;
    const mockRes = {} as Response;

    const asyncFn = async () => {
      return "success";
    };

    const wrapped = asyncHandler(asyncFn);
    await wrapped(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
});
