import {
    createTState, updateTState, updateAddresses, updateBalance, 
    updateDzhvBalance, commitTState, poll
} from '../internal.ts'

export async function onAccountsChanged() {
    console.log('ACCOUNT')
    const { tState, abortController, updaters } = createTState(['addresses',
        'balance', 'dzhvBalance'])
    await updateTState({
        tState,
        updaters: [updateAddresses, updateBalance, updateDzhvBalance, ...updaters],
        abortController
    }).catch(reason => { console.error(reason); return } )
    if (abortController.signal.aborted) return
    await commitTState(tState)
    poll()
}