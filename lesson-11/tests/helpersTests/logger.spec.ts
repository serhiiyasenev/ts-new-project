import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "../../src/helpers/logger";

describe("Logger", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs info messages", () => {
    logger.info("Test info");
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it("logs info messages with context", () => {
    logger.info("Test info", { userId: 123 });
    expect(consoleLogSpy).toHaveBeenCalled();
    const call = consoleLogSpy.mock.calls[0][0];
    expect(call).toContain("Test info");
    expect(call).toContain("userId");
  });

  it("logs error messages", () => {
    logger.error("Test error");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("logs error messages with context", () => {
    logger.error("Test error", { code: 500 });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("logs warn messages", () => {
    logger.warn("Test warning");
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it("logs debug messages in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    logger.debug("Test debug");
    expect(consoleDebugSpy).toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it("does not log debug messages in production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    // Need to reimport logger to get new instance with production env
    vi.resetModules();
    const { logger: prodLogger } = await import("../../src/helpers/logger");

    const prodDebugSpy = vi
      .spyOn(console, "debug")
      .mockImplementation(() => {});

    prodLogger.debug("Test debug");
    expect(prodDebugSpy).not.toHaveBeenCalled();

    prodDebugSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});
