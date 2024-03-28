import { signal } from "@preact/signals";
import { InjectedProvider, UpdaterOpts } from "../internal.ts";

const globalWithEthereum = globalThis as typeof globalThis & {
    ethereum?: InjectedProvider;
  },
  gwe = globalWithEthereum;

const provider = signal<undefined | InjectedProvider | null>(undefined);

async function updateProvider({ tState, signal }: UpdaterOpts) {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  if (tState.provider) return;
  tState.provider = gwe.ethereum ?? new Error("no injected provider detected");
  await Promise.resolve();
}

export { provider, updateProvider };
