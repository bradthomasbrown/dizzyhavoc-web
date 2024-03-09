import { rlb } from "../../../../llc/rlb/mod.ts";
import {
    createTState, updateTState, updateAddresses, updateBalance, 
    updateDzhvBalance, commitTState, poll
} from '../internal.ts'

export async function onAccountsChanged() {
    console.log('ACCOUNT')
    const { tstate, abortController } = createTState(['addresses',
        'balance', 'dzhvBalance'])
    rlb.delay = 333
    await updateTState({
        tstate,
        updaters: [updateAddresses, updateBalance, updateDzhvBalance],
        abortController
    }).catch(console.error)
    if (abortController.signal.aborted) return
    rlb.delay = 1000
    commitTState(tstate)
    poll()
}