import {
    createTState, updateTState, commitTState,
    updateBalance, updateDzhvBalance, e, ttrack
} from '../internal.ts'

export async function poll() {
    while (true) {
        console.log('POLL')
        const { tstate, abortController } = createTState(['balance',
            'dzhvBalance'])
        if (!tstate.rpc) {
            console.error(new Error(`cannot poll, tstate.rpc missing`))
            return
        }
        const height = await e.height().call({
            url: tstate.rpc,
            signal: abortController.signal
        }).catch(() => null)
        if (abortController.signal.aborted) break
        if (height === null) {
            console.error(new Error(`error polling, height null`))
            continue
        }
        if (!tstate.height || height <= tstate.height) continue
        await updateTState({
            tstate,
            updaters: [updateBalance, updateDzhvBalance],
            abortController
        })
        if (abortController.signal.aborted) break
        commitTState(tstate)
    }
}