import { rlb } from 'https://deno.land/x/rlb@0.0.0/mod.ts'
import {
    createTState, updateTState, requestAddresses, updateBalance, 
    updateChainId, updateDzhv, updateDzhvBalance, updateHeight,
    updateProvider, updateRpc, commitTState, poll
} from '../internal.ts'

export async function init() {
    console.log('INIT')
    const { tstate, abortController } = createTState([])
    rlb.delay = 333
    await updateTState({
        tstate,
        updaters: [requestAddresses, updateBalance, 
            updateChainId,  updateDzhv, updateDzhvBalance, 
            updateHeight, updateProvider, updateRpc],
        abortController
    }).catch(console.error)
    if (abortController.signal.aborted) return
    rlb.delay = 1000
    commitTState(tstate)
    poll()
}