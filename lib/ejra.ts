import { Ejra } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/ejra@0.0.8-toad/mod.ts";
import { toad } from "lib/mod.ts";

export const ejra = new Ejra(toad);

;(async () => { for await (const e of ejra.err) e })()//console.error(e) })()
;(async () => { for await (const m of ejra.out) m })()//console.log(m) })()