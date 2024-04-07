import { Signal } from "@preact/signals";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import { dzkv } from "lib/mod.ts";
import "lib/bridge/mod.ts";

type T = Signal<null | Chain>;

export function key(id: string[]) {
  return ["chains", ...id];
}

export function ensure(id: string[]) {
  dzkv.ensure<T>(key(id), new Signal(null));
}

export function get(id: string[]) {
  ensure(id);
  return dzkv.get<T>(key(id))!;
};

export function set(id: string[], chain: Chain) {
  get(id).value = chain;
};
