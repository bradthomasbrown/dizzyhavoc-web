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
        return `Balance: ${w3LabelConv({ big, dec, sym, tarLen, maxExt })}`
    } else return 'Unknown Balance'
})

export function Balance() {
    return (<div class="text-xl font-[Poppins] mb-4">{balance}</div>)
}