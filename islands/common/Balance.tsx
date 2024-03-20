import { computed } from "@preact/signals"
import {
    dzhvBalance,
    w3LabelConv
} from "../../lib/internal.ts";

const balance = computed(() => {
    if (dzhvBalance.value) {
        const big = dzhvBalance.value
        const dec = 18
        const sym = 'DZHV'
        const tarLen = 16
        const maxExt = Infinity
        return `${w3LabelConv({ big, dec, sym, tarLen, maxExt })}`
    } else return 'Unknown'
})

export function Balance() {
    return (<div class="text-sm text-[#2c2c2ca9] justify-center text-center dark:text-[#EAEAEAa9] font-[Poppins] mb-4">Balance<div class="text-xl text-[#2c2c2c] dark:text-[#EAEAEA] font-[Poppins]">{balance}</div></div>)
}