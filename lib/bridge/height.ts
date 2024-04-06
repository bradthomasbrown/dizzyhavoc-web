import { effect, Signal } from "@preact/signals";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import { dzkv, ejra } from "lib/mod.ts";
import { state } from "lib/bridge/mod.ts";
import "lib/bridge/mod.ts";

type T = { b: Signal<null | bigint>; f: Signal<null | bigint> };

export function key(chain: Chain) {
  return ["heights", chain];
}

export function ensure(chain: Chain) {
  return dzkv.ensure<T>(key(chain), {
    b: new Signal(null),
    f: new Signal(null),
  });
}

export const get = (chain: Chain) => {
  ensure(chain);
  return dzkv.get<T>(key(chain))!;
};

export const set = (chain: Chain, height: bigint) => {
  get(chain).b.value = height;
};

type U = Signal<symbol>;

const sym = {
  key: function (chain: Chain) {
    return [...key(chain), "symbol"];
  },

  ensure: function (chain: Chain) {
    return dzkv.ensure<U>(this.key(chain), new Signal(Symbol()));
  },

  get: function (chain: Chain) {
    this.ensure(chain);
    return dzkv.get<U>(this.key(chain))!;
  },

  refresh: function (chain: Chain) {
    setTimeout(() => this.get(chain).value = Symbol(), 0);
  },
};

[["from"], ["to"]].map((id) =>
  effect(async () => {

    // get dependencies
    const chain = state.chain.get(id).value;
    const url = chain?.rpc.at(0);
    if (!chain || !url) return;

    // access the chain's symbol signal to track it
    sym.get(chain).value;

    // get height, returning if error
    const height = await ejra.height(url);
    // after getting the height, refresh the chain's symbol signal to loop
    sym.refresh(chain);
    if (height instanceof Error) {
      console.error(height);
      return;
    }

    // update height if it's greater than the previous height
    const prevHeight = get(chain).b.value;
    if (prevHeight && height <= prevHeight) return;
    console.log({ prevHeight, height });
    set(chain, height);

  })
);
