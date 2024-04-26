import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { econConf } from "lib/vertinfo/schema/econConf.ts";

export type EconConf = z.infer<typeof econConf>