import * as jra from "https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.0.6/mod.ts";

export function badParse() {
  return jra.error({ code: -32700, message: "Parse error.", status: 500 });
}
