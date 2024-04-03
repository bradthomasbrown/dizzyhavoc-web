import { computed, Signal } from "@preact/signals";
import { viVortex } from "./viVortex/viVortex.ts";
import { chosenChains } from "./chosenChains.ts";

const toChain = chosenChains.get('to')!
const dummy = new Signal(0)
toChain.subscribe(() => dummy.value++)

export const amounts:Map<string,Signal<undefined|bigint>> = new Map([
  ['from', new Signal<undefined|bigint>(undefined)],
  ['to', computed<undefined|bigint>(() => {

    dummy.value

    const econConfs = viVortex.uState.econConf.value
    if (econConfs === undefined || econConfs instanceof Error) return

    if (amounts.get('from')!.value === undefined) return
    
    const chain = toChain.value
    if (chain === undefined) return
    
    const econConf = econConfs.get(chain)
    if (!econConf) return

    let toAmount = amounts.get('from')!.value! - BigInt(econConf.baseFee) * 10n ** 18n;
    if (toAmount < 0n) toAmount = 0n;

    return toAmount;

  })]
])
