import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.0.3/mod.ts'

export function rateLimit() {
  return jra.error({ code: -32005, message: "Rate limited.", status: 429 });
}
