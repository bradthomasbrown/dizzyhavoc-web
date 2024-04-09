import { Signal } from "@preact/signals";
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { dzkv, ejra } from "lib/mod.ts";
import { data } from "lib/bridge/mod.ts";
import { Options } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/ejra@0.0.10-toad/types/Params.ts";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";

export type SubKey = readonly [chainId: number, address: string, ...parts: unknown[]];
type SubState = {
  chainId: number;
  address: string;
  parts: unknown[];
  height: bigint;
};
export type State = { subState: SubState; value: bigint };
export type MaybeState = null | State;
type StateSignal = Signal<MaybeState>;

function key(subKey: SubKey) {
  return ["balance", ...subKey];
}

function ensure(subKey: SubKey) {
  return dzkv.ensure<StateSignal>(key(subKey), new Signal(null));
}

export function get(subKey: SubKey) {
  ensure(subKey);
  return dzkv.get<StateSignal>(key(subKey))!;
}

function set(subKey: SubKey, state: State) {
  get(subKey).value = state;
}

type Nullable<T> = { [k in keyof T]: null | T[k] };
type GetValueArgs = {
  chain: Chain;
  url: string;
  address: string;
  height: bigint;
  controller: AbortController;
};
const getValueArgs: Nullable<GetValueArgs> & { controller: AbortController } = {
  chain: null,
  url: null,
  address: null,
  height: null,
  controller: new AbortController(),
};
const heightWatchDisposer: { value: null | (() => void) } = { value: null };

async function getValue(args: GetValueArgs) {
  const { chain, url, address, height, controller } = args;
  const { chainId } = chain;
  const parts = ["dzhv"];
  const subKey: SubKey = [chainId, address, ...parts];
  const subState: SubState = { chainId, address, height, parts };

  if (height <= (get(subKey).value?.subState.height ?? -Infinity)) return;
  if (controller.signal.aborted) return;

  const input = `0x70a08231${address.slice(2).padStart(64, "0")}`;
  const to = "0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe";
  const tx = { to, input };
  const options = new Options({ signal: controller.signal });
  const value = await ejra.call(url, tx, height, options)
    .then(z.instanceof(Error).or(z.string().transform(BigInt)).parseAsync)
    .catch((reason: Error) => reason);

  if (controller.signal.aborted) return;
  if (value instanceof Error) return;

  const state: State = { subState, value };
  set(subKey, state);
}

async function onHeightChange(state: data.height.MaybeState) {
  if (state === null) return;
  getValueArgs.height = state.value;
  if (!Object.values(getValueArgs).includes(null)) {
    await getValue(getValueArgs as NonNullable<GetValueArgs>);
  }
  data.height.symbol.value = Symbol();
}

function onChainChange(state: data.chain.MaybeState) {
  getValueArgs.controller.abort();
  getValueArgs.controller = new AbortController();
  heightWatchDisposer.value?.();
  getValueArgs.height = null;
  getValueArgs.chain = null;
  getValueArgs.url = null;
  if (!state) return;
  const chain = state.value;
  const { chainId } = chain;
  getValueArgs.chain = state.value;
  getValueArgs.height = data.height.get([chainId]).value?.value ?? null;
  heightWatchDisposer.value = data.height.get([chainId]).subscribe(
    onHeightChange,
  );
  const url = chain.rpc.at(0);
  if (!url) return;
  getValueArgs.url = url;
  if (Object.values(getValueArgs).includes(null)) return;
  getValue(getValueArgs as NonNullable<GetValueArgs>);
}

function onAddressesChange(state: data.addresses.MaybeState) {
  getValueArgs.controller.abort();
  getValueArgs.controller = new AbortController();
  getValueArgs.address = null;
  if (!state) return;
  const addresses = state.value;
  const address = addresses.at(0);
  if (!address) return;
  getValueArgs.address = address;
  if (Object.values(getValueArgs).includes(null)) return;
  getValue(getValueArgs as NonNullable<GetValueArgs>);
}

function onChainIdChange() {
  getValueArgs.controller.abort();
  getValueArgs.controller = new AbortController();
  heightWatchDisposer.value?.();
  getValueArgs.height = null;
  getValueArgs.chain = null;
  getValueArgs.url = null;
}

data.chain.get(["from"]).subscribe(onChainChange);
data.addresses.get().subscribe(onAddressesChange);
data.chainId.get(["from"]).subscribe(onChainIdChange);
