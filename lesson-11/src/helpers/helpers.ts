// Helper to parse CSV strings from query parameters
export function parseCsv(value?: string): string[] | undefined {
  if (!value) return undefined;
  return value.split(",").map(s => s.trim()).filter(Boolean);
}