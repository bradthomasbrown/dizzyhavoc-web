import { effect, Signal } from "@preact/signals";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { dzkv, ejra } from "lib/mod.ts";
import { state, data } from "lib/bridge/mod.ts";
import { A } from 'lib/bridge/state.ts'
import { Options } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/ejra@0.0.8-toad/types/Params.ts"

type T = A<null|bigint>

function key(chain: Chain, address:string, id:string[]=[]) {
  return ["balances", chain, address, ...id];
}

function ensure(chain: Chain, address:string, id:string[]=[]) {
  return dzkv.ensure<T>(key(chain, address, id), {
    b: new Signal(null),
    f: new Signal(null)
  })
}

export function get(chain: Chain, address:string, id:string[]=[]) {
  ensure(chain, address, id);
  return dzkv.get<T>(key(chain, address, id))!;
}

function set(chain: Chain, address:string, id: string[]=[], balance:bigint) {
  get(chain, address, id).b.value = balance
  setTimeout(() => state.suggest(get(chain, address, id), balance), 0)
  console.log('suggest balance', balance)
}

export function invalidate(chain: Chain, address:string, id: string[]=[]) {
  console.log('invalidate balance')
  state.invalidate(get(chain, address, id))
}

effect(async () => {

  // get dependencies
  const addresses = data.addresses.get().value
  const address = addresses?.at(0)
  const chain = data.chain.get(['from']).value
  const url = chain?.rpc.at(0)
  if (!chain || !url || !address) return
  const height = data.height.get(chain).b.value
  if (height === null) return

  invalidate(chain, address, ['dzhv'])

  // create and update controller for state B type
  const controller = new AbortController()
  const { signal } = controller
  state.get().b.set(get(chain, address, ['dzhv']), controller)
  const options = new Options({ signal })

  // get the balance, returning if error
  const input = `0x70a08231${address.slice(2).padStart(64, "0")}`;
  const to = "0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe";
  const balance = await ejra.call(url, { to, input }, height, options)
    .then(z.instanceof(Error).or(z.string().transform(BigInt)).parseAsync)
    .catch((reason: Error) => reason);
  if (balance instanceof Error) return

  set(chain, address, ['dzhv'], balance)

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
