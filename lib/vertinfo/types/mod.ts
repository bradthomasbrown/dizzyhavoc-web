import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import * as schemas from "../schemas/mod.ts";

export type EconConf = {
  gasLimitMultiplier: [numerator: bigint, denominator: bigint];
  gasPriceMultiplier: [numerator: bigint, denominator: bigint];
  baseFee: bigint;
};

export type JsonRpcId = string | number | null;

export type JsonRpcErrorObject = z.infer<typeof schemas.jsonRpc.errorObject>;

export type JsonRpcErrorResponse = z.infer<
  typeof schemas.jsonRpc.errorResponse
>;

export type JsonRpcResponse = z.infer<typeof schemas.jsonRpc.response>;

export type JsonRpcErrorOptions = {
  code: number;
  message: string;
  status: number;
  id?: JsonRpcId;
};

export type JsonRpcResponseOptions = { result: unknown; id: JsonRpcId };

export type JsonRpcRequest = z.infer<typeof schemas.jsonRpc.request>;
