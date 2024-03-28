import { Signal, computed } from "@preact/signals"
import {
    w3LabelConv
} from "../../lib/internal.ts";
import { vortex } from '../../lib/faucet/vortex.ts'

const balance = computed(() => {
    const balance = vortex.uState.dzhvBalance.value
    const big = !balance || balance instanceof Error ? 0n : balance
    const dec = 18
    const sym = 'DZHV'
    const tarLen = 16
    const maxExt = Infinity
    return `${w3LabelConv({ big, dec, sym, tarLen, maxExt })}`
})

export function Balance() {
    return (<div class="text-sm unselectable text-[#2c2c2ca9] justify-center text-center dark:text-[#EAEAEAa9] font-[Poppins] mb-4">Balance<div class="text-xl selectable text-[#2c2c2c] dark:text-[#EAEAEA] font-[Poppins]">{balance}</div></div>)
}