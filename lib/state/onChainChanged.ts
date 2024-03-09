import { rlb } from "../../../../llc/rlb/mod.ts";
import {
    createTState, updateTState, updateBalance, 
    updateChainId, updateDzhv, updateDzhvBalance, updateHeight,
    updateRpc, commitTState, poll
} from '../internal.ts'

export async function onChainChanged() {
    console.log('CHAIN')
    const { tstate, abortController } = createTState(['balance',
        'chainId', 'dzhv', 'dzhvBalance', 'height', 'rpc'])
    rlb.delay = 333
    await updateTState({
        tstate,
        updaters: [updateBalance, updateChainId, updateDzhv,
            updateDzhvBalance, updateHeight, updateRpc],
        abortController
    }).catch(console.error)
    if (abortController.signal.aborted) return
    rlb.delay = 1000
    commitTState(tstate)
    poll()
}