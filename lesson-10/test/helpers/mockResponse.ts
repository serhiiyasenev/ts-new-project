export function createMockResponse(options: {
  ok: boolean;
  status?: number;
  json?: () => Promise<unknown>;
  headers?: Record<string, string>;
}) {
  const headers = new Map(
    Object.entries(options.headers || { "content-type": "application/json" })
  );

  return {
    ok: options.ok,
    status: options.status || (options.ok ? 200 : 500),
    headers: {
      get: (key: string) => headers.get(key.toLowerCase()) || null,
    },
    json: options.json || (async () => ({})),
  };
}
