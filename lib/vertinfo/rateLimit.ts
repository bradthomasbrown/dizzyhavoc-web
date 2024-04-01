export const lastRequestTimeMap: Map<string, number> = new Map();

export function rateLimit(hostname: string) {
  const lastRequestTime = lastRequestTimeMap.get(hostname);
  if (!lastRequestTime) return false;
  return Date.now() - lastRequestTime < 200;
}
