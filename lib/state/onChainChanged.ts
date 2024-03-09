import {
    createTState, updateTState, updateBalance, 
    updateChainId, updateDzhv, updateDzhvBalance, updateHeight,
    updateRpc, commitTState
} from '../internal.ts'

export async function onChainChanged() {
    console.log('CHAIN')
    const tstate = createTState(['balance', 'chainId', 'dzhv',
        'dzhvBalance', 'height', 'rpc'])
    await updateTState(tstate, [updateBalance, updateChainId,
        updateDzhv, updateDzhvBalance, updateHeight, updateRpc])
    commitTState(tstate)
}