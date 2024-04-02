import { effect, Signal } from "@preact/signals";
import { extVortex } from "./extVortex/extVortex.ts";
import { chosenChains } from "./chosenChains.ts";

export const amounts = new Map([
  ['from', new Signal<undefined|bigint>(undefined)],
  ['to', new Signal<undefined|bigint>(undefined)]
])

effect(() => {

  const fromAmount = amounts.get('from')!.value;
  if (fromAmount === undefined) return

  const econConfs = extVortex.uState.econConf.value
  if (econConfs === undefined || econConfs instanceof Error) return
  
  const chain = chosenChains.get('to')!.value
  if (chain === undefined) return
  
  const econConf = econConfs.get(chain)
  if (!econConf) return

  let toAmount = fromAmount - BigInt(econConf.baseFee) * 10n ** 18n;
  if (toAmount < 0n) toAmount = 0n;

  amounts.get('to')!.value = toAmount;

});
