import { Filter, Tag, TxCallObject } from "./mod.ts";

export class Options {
  signal?: AbortSignal;
  constructor({ signal }: { signal?: AbortSignal } = {}) {
    this.signal = signal;
  }
}

export type Params = {
  clientVersion: [options?: Options];
  sha3: [data: string, options?: Options];
  chainId: [options?: Options];
  gasPrice: [options?: Options];
  height: [options?: Options];
  balance: [address: string, tag: Tag, options?: Options];
  slot: [address: string, slot: bigint, tag: Tag, options?: Options];
  nonce: [address: string, tag: Tag, options?: Options];
  code: [address: string, tag: Tag, options?: Options];
  send: [data: string, options?: Options];
  call: [txCallObject: TxCallObject, tag: Tag, options?: Options];
  estimateGas: [txCallObject: Partial<TxCallObject>, options?: Options];
  receipt: [hash: string, options?: Options];
  logs: [filter: Filter, options?: Options];
};
