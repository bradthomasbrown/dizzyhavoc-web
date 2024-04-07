import { effect, Signal } from "@preact/signals";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import { dzkv, ejra } from "lib/mod.ts";
import { state, data } from "lib/bridge/mod.ts";
import { A } from 'lib/bridge/state.ts'
import { Options } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/ejra@0.0.8-toad/types/Params.ts";

type T = A<null|bigint>

function key(chain: Chain) {
  return ["heights", chain];
}

function ensure(chain: Chain) {
  return dzkv.ensure<T>(key(chain), {
    b: new Signal(null),
    f: new Signal(null),
  });
}

export function get(chain: Chain) {
  ensure(chain);
  return dzkv.get<T>(key(chain))!;
}

function set(chain: Chain, height: bigint) {
  get(chain).b.value = height;
  setTimeout(() => state.suggest(get(chain), height), 0)
  console.log('suggest height', height)
}

function invalidate(chain: Chain) {
  console.log('invalidate height')
  state.invalidate(get(chain))
}

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
    const chain = data.chain.get(id).value;
    const url = chain?.rpc.at(0);
    if (!chain || !url) return;
    sym.get(chain).value;

    // create and update controller for state B type
    const controller = new AbortController()
    const { signal } = controller
    state.get().b.set(get(chain), controller)
    const options = new Options({ signal })

    // get height, returning if error
    const height = await ejra.height(url, options)
      .catch((reason:Error) => reason)
    if (height instanceof Error) {
      state.get().s.delete(get(chain))
      sym.refresh(chain)
      return 
    }

    // check if the new height is > prevHeight (or prevHeight null)
    const prevHeight = get(chain).b.value;
    if (prevHeight && height <= prevHeight) {
      state.get().s.delete(get(chain))
      sym.refresh(chain);
      return 
    }

    invalidate(chain)

    state.get().c.add(() => sym.refresh(chain));

    set(chain, height);

  })
);
