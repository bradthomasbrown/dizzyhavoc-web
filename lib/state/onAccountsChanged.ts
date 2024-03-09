import {
    createTState, updateTState, updateAddresses, updateBalance, 
    updateDzhvBalance, commitTState
} from '../internal.ts'

export async function onAccountsChanged() {
    console.log('ACCOUNT')
    const tstate = createTState(['addresses', 'balance', 'dzhvBalance'])
    await updateTState(tstate, [updateAddresses, updateBalance, 
        updateDzhvBalance])
    commitTState(tstate)
}