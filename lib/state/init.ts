import {
    createTState, updateTState, requestAddresses, updateBalance, 
    updateChainId, updateDzhv, updateDzhvBalance, updateHeight,
    updateProvider, updateRpc, commitTState, poll
} from '../internal.ts'

export async function init() {
    console.log('INIT')
    const { tState, abortController } = createTState([])
    await updateTState({
        tState,
        updaters: [requestAddresses, updateBalance, 
            updateChainId, updateDzhv, updateDzhvBalance, 
            updateHeight, updateProvider, updateRpc],
        abortController
    }).catch(reason => { console.error(reason); return } )
    if (abortController.signal.aborted) return
    await commitTState(tState)
    poll()
}