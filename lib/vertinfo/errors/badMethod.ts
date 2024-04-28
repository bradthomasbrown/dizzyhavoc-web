import * as jra from "https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.0.6/mod.ts";

export function badMethod() {
  return jra.error({
    code: -32601,
    message: "Method not found.",
    status: 404,
  });
}
