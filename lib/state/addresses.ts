import { signal } from "@preact/signals";
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { UpdaterOpts } from "../internal.ts";

const addresses = signal<undefined | string[] | null>(undefined);

async function updateAddresses({ tState, signal }: UpdaterOpts) {
  // pre-check
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  // logic
  if (tState.addresses !== undefined) return;
  if (tState.provider instanceof Error) {
    tState.addresses = tState.provider;
    return;
  }
  if (tState.provider === undefined) return;

  // get and parse
  const addresses = await tState.provider.request({
    method: "eth_accounts",
    params: [],
  })
    .then(z.string().array().parseAsync).catch((e) => new Error(e));

  // post-check
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  // commit
  tState.addresses = addresses;
}

async function requestAddresses({ tState, signal }: UpdaterOpts) {
  // pre-check
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  // logic
  if (tState.addresses) return;
  if (tState.provider instanceof Error) {
    tState.addresses = tState.provider;
    return;
  }
  if (tState.provider === undefined) return;

  // get and parse
  const addresses = await tState.provider.request({
    method: "eth_requestAccounts",
    params: [],
  })
    .then(z.string().array().parseAsync).catch((e) => new Error(e));

  // post-check
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  // commit
  tState.addresses = addresses;
}

export { addresses, requestAddresses, updateAddresses };
