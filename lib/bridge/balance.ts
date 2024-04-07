import { effect, Signal } from "@preact/signals";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { dzkv, ejra } from "lib/mod.ts";
import { state, data } from "lib/bridge/mod.ts";
import { A } from 'lib/bridge/state.ts'

type T = A<null|bigint>

function key(chain: Chain, id:string[]=[]) {
  return ["balances", chain, ...id];
}

function ensure(chain: Chain, id:string[]=[]) {
  return dzkv.ensure<T>(key(chain, id), {
    b: new Signal(null),
    f: new Signal(null)
  })
}

export function get(chain: Chain, id:string[]=[]) {
  ensure(chain, id);
  return dzkv.get<T>(key(chain, id))!;
}

function set(chain: Chain, id: string[]=[], balance:bigint) {
  get(chain, id).b.value = balance
  state.suggest(get(chain, id), balance)
}

export function invalidate(chain: Chain, id: string[]=[]) {
  state.invalidate(get(chain, id))
}

effect(async () => {

  // get dependencies
  const addresses = data.addresses.get().value
  const address = addresses?.at(0)
  const chain = data.chain.get(['from']).value
  const url = chain?.rpc.at(0)
  if (!chain || !url || !address) return
  const height = data.height.get(chain).b.value
  if (!height) return

  // get the balance, returning if error
  const input = `0x70a08231${address.slice(2).padStart(64, "0")}`;
  const to = "0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe";
  const balance = await ejra.call(url, { to, input}, height)
    .then(z.instanceof(Error).or(z.string().transform(BigInt)).parseAsync)
    .catch((reason: Error) => reason);
  if (balance instanceof Error) {
    console.error(balance)
    return
  }

  console.log({ balance })

  set(chain, ['dzhv'], balance)

})

// const addressesKey = ["addresses", "p6963"];
// const fromChainKey = ["chains", "from"];

// type AddressesSignal = Signal<string[]>;
// type ChainSignal = Signal<null | Chain>;
// type BigintSignal = Signal<null | bigint>;

// dzkv.ensure<AddressesSignal>(addressesKey, new Signal([]));
// dzkv.ensure<ChainSignal>(fromChainKey, new Signal(null));

// effect(async () => {
//   // get dependencies
//   const chain = dzkv.get<ChainSignal>(fromChainKey)!.value;
//   const url = chain?.rpc.at(0);
//   const address = dzkv.get<AddressesSignal>(addressesKey)!.value.at(0);
//   if (!chain || !url || !address) return;
//   // create height key and ensure height signal exists for this chain
//   const heightKey = ["heights", chain];
//   dzkv.ensure<BigintSignal>(heightKey, new Signal(null));
//   // get the height, logging error if it exists
//   const height = dzkv.get<BigintSignal>(heightKey)!.value;
//   if (!height) return;

//   // get balance
//   const input = `0x70a08231${address.slice(2).padStart(64, "0")}`;
//   const to = "0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe";
//   const balance = await ejra.call(url, { input, to }, height)
//     .then(z.instanceof(Error).or(z.string().transform(BigInt)).parseAsync)
//     .catch((reason: Error) => reason);
//   if (balance instanceof Error) return;

//   // update balance
//   const balanceKey = ["balances", chain, "dzhv"];
//   if (!dzkv.ensure<BigintSignal>(balanceKey, new Signal(balance))) {
//     dzkv.get<BigintSignal>(balanceKey)!.value = balance;
//   }

//   console.log({ height, balanceKey, balance });
// });
