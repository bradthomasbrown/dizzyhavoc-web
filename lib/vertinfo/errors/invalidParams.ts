import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.0.6/mod.ts'

export function invalidParams(id?: number|string|null) {
  return jra.error({
    code: -32602,
    message: "Invalid params.",
    status: 500,
    id,
  });
}
