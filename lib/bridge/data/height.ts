import { Signal } from "@preact/signals";
import { dzkv, ejra } from "lib/mod.ts";
import { data } from "lib/bridge/mod.ts";
import { Options } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/ejra@0.0.10-toad/types/Params.ts";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";

export type SubKey = readonly [chainId: number];
type SubState = { chainId: number };
export type State = { subState: SubState; value: bigint };
export type MaybeState = null | State;
type StateSignal = Signal<MaybeState>;

function key(subKey: SubKey) {
  return ["height", ...subKey];
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
  controller: AbortController;
};
const getValueArgs: Nullable<GetValueArgs> & { controller: AbortController } = {
  chain: null,
  url: null,
  controller: new AbortController(),
};
export const symbol = new Signal(Symbol());
symbol.subscribe(onSymbolChange);

async function getValue(args: GetValueArgs) {
  const { chain, url, controller } = args;
  const { chainId } = chain;
  const subKey: SubKey = [chainId];
  const subState: SubState = { chainId };

  if (controller.signal.aborted) return;

  const options = new Options({ signal: controller.signal });
  const value = await ejra.height(url, options)
    .catch((reason: Error) => new Error(String(reason)));

  if (controller.signal.aborted) return;
  if (value instanceof Error) return symbol.value = Symbol();
  if (value <= (get(subKey).value?.value ?? -Infinity)) {
    return symbol.value = Symbol();
  }

  const state: State = { subState, value };
  set(subKey, state);
}

function onSymbolChange() {
  if (Object.values(getValueArgs).includes(null)) return;
  getValue(getValueArgs as NonNullable<GetValueArgs>);
}

function onChainChange(state: data.chain.MaybeState) {
  getValueArgs.controller.abort();
  getValueArgs.controller = new AbortController();
  getValueArgs.chain = null;
  getValueArgs.url = null;
  if (!state) return;
  const chain = state.value;
  getValueArgs.chain = chain;
  const url = chain.rpc.at(0);
  if (!url) return;
  getValueArgs.url = url;
  if (Object.values(getValueArgs).includes(null)) return;
  getValue(getValueArgs as NonNullable<GetValueArgs>);
}

function onChainIdChange() {
  getValueArgs.controller.abort();
  getValueArgs.controller = new AbortController();
  getValueArgs.chain = null;
  getValueArgs.url = null;
}

data.chain.get(["from"]).subscribe(onChainChange);
data.chainId.get(["from"]).subscribe(onChainIdChange);
