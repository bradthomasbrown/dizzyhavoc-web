import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { schemas } from "../internal.ts";

type Chain = z.infer<typeof schemas.chain>;

export type { Chain };
