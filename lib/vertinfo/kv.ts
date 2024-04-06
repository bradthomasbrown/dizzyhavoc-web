/// <reference lib="deno.unstable" />

const IS_LOCAL = Deno.env.get("IS_LOCAL");
let BETA_KV_PATH: undefined | string;
if (IS_LOCAL) {
  BETA_KV_PATH = Deno.env.get("BETA_KV_PATH");
  if (!BETA_KV_PATH) {
    throw new Error(`missing required env var 'BETA_KV_PATH'`);
  }
}
export const kv = await Deno.openKv(IS_LOCAL ? BETA_KV_PATH : undefined);

// https://api.deno.com/databases/348e5818-c2f2-4ae6-99be-43289b817803/connect
