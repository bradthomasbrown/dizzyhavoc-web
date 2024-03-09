import {
    createTState, updateTState, requestAddresses, updateBalance, 
    updateChainId, updateDzhv, updateDzhvBalance, updateHeight,
    updateProvider, updateRpc, commitTState
} from '../internal.ts'

export async function init() {
    console.log('INIT')
    const tstate = createTState([])
    await updateTState(tstate, [requestAddresses, updateBalance, 
        updateChainId,  updateDzhv, updateDzhvBalance, 
        updateHeight, updateProvider, updateRpc])
    commitTState(tstate)
}