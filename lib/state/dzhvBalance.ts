import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { signal } from "@preact/signals";
import { UpdaterOpts } from "../internal.ts";
import { ejra } from "../faucet/ejra.ts";

const dzhvBalance = signal<undefined | bigint | null>(undefined);

async function updateDzhvBalance({ tState, signal }: UpdaterOpts) {
  // pre-check
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  // logic
  if (tState.dzhvBalance !== undefined) return;
  if (tState.addresses instanceof Error) {
    tState.dzhvBalance = tState.addresses;
    return;
  }
  if (tState.dzhv instanceof Error) {
    tState.dzhvBalance = tState.dzhv;
    return;
  }
  if (tState.height instanceof Error) {
    tState.dzhvBalance = tState.height;
    return;
  }
  if (tState.rpc instanceof Error) {
    tState.dzhvBalance = tState.rpc;
    return;
  }
  if (
    tState.addresses === undefined || tState.dzhv === undefined ||
    tState.height === undefined || tState.rpc === undefined
  ) return;

  const address = tState.addresses[0];
  if (!address) {
    tState.dzhvBalance = new Error("tState.addresses empty");
    return;
  }

  // get and parse
  const dzhvBalance = await ejra.call(
    tState.rpc,
    {
      to: tState.dzhv.address,
      input: `0x70a08231${address.substring(2).padStart(64, "0")}`,
    },
    tState.height,
  ).then(z.string().transform(BigInt).parseAsync).catch((e) => new Error(e));

  // post-check
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  // commit
  tState.dzhvBalance = dzhvBalance;
}

export { dzhvBalance, updateDzhvBalance };
