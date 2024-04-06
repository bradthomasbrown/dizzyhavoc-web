import { Signal } from "@preact/signals";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import { dzkv } from "lib/mod.ts";
import "lib/bridge/mod.ts";

type T = Signal<null | Chain>;
export const key = (id: string[]) => ["chains", ...id];
export const ensure = (id: string[]) =>
  dzkv.ensure<T>(key(id), new Signal(null));
export const get = (id: string[]) => {
  ensure(id);
  return dzkv.get<T>(key(id))!;
};
export const set = (id: string[], chain: Chain) => {
  ensure(id);
  get(id).value = chain;
};
