/// <reference lib="deno.unstable" />

const ISLOCAL = Deno.env.get("ISLOCAL");
let BETA_DZHV_KV_PATH: undefined | string;
if (ISLOCAL) {
  BETA_DZHV_KV_PATH = Deno.env.get("BETA_DZHV_KV_PATH");
  if (!BETA_DZHV_KV_PATH) {
    throw new Error(`missing required env var 'BETA_DZHV_KV_PATH'`);
  }
}
export const kv = await Deno.openKv(ISLOCAL ? BETA_DZHV_KV_PATH : undefined);
