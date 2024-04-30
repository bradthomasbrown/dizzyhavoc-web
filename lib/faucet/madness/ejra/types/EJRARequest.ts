import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export type EJRARequest = {
  method: string;
  params: readonly unknown[];
  schema: z.ZodTypeAny;
};
