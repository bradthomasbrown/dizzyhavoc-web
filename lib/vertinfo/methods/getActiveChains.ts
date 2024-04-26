import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.0.6/mod.ts'
import { kv } from "lib/vertinfo/kv.ts";

export async function getActiveChains({ id }: Pick<jra.types.RequestO, "id">) {
  const kvem = await kv.get<number[]>(["activeChains"]);
  return jra.respond({ result: kvem.value, id });
}
