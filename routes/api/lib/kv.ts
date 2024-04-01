const ISLOCAL = Deno.env.get("ISLOCAL");
let VERTPUBINFOKVPATH: undefined | string;
if (ISLOCAL) {
  VERTPUBINFOKVPATH = Deno.env.get("DENO_KV_PATH");
  if (!VERTPUBINFOKVPATH) {
    throw new Error(`missing required env var 'VERTPUBINFOKVPATH'`);
  }
}
export const kv = await Deno.openKv(ISLOCAL ? VERTPUBINFOKVPATH : undefined);
