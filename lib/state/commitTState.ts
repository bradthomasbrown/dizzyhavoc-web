import { Signal, batch } from "@preact/signals-core"
import { DAppState, TState, state } from '../internal.ts'

export function commitTState(tstate:TState) {
    // if tstate contains null values, we cannot commit
    if (Object.values(tstate).includes(null)) {
        const nullKeys = Object.entries(tstate)
            .filter(([_,v]) => v === null)
            .map(([k]) => k)
        // log keys of TState with null values
        console.error(new Error(`cannot commit TState due to nullKeys: ${
            JSON.stringify(nullKeys)}`))
        return
    }
    // if tstate nonce <= ustate nonce, then don't commit
    if (tstate.stateNonce <= state.stateNonce) {
        console.log(`not committing TState, old stateNonce (T${
            tstate.stateNonce} <= U${state.stateNonce})`)
        return
    }
    // batch update state signals using tstae
    batch(() => {
        // pull signals from UState
        const stateSignals = Object.entries(state)
            .filter(([_,v]) => v instanceof Signal) as
                [keyof DAppState, Signal][]
        // update signal values
        for (const [key, signal] of stateSignals)
            signal.value = tstate[key]
        // update stateNonce
        state.stateNonce = tstate.stateNonce
    })
}