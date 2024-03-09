import {
    createTState, updateTState, commitTState,
    updateBalance, updateDzhvBalance, e
} from '../internal.ts'

export async function poll() {
    while (true) {
        console.log('POLL')
        const tstate = createTState(['balance, dzhvBalance'])
        if (!tstate.rpc) {
            console.error(new Error(`cannot poll, tstate.rpc missing`))
            return
        }
        const height = await e.height().call({ url: tstate.rpc })
            .catch(() => null)
        if (height === null) {
            console.error(new Error(`error polling, height null`))
            continue
        }
        if (!tstate.height || height <= tstate.height) continue
        await updateTState(tstate, [updateBalance, updateDzhvBalance])
        commitTState(tstate)
    }
}