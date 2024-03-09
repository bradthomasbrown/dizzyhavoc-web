import { Signal } from "@preact/signals";
import { TState, state, getStateNonce, ttrack } from '../internal.ts'
import { DAppState } from "../internal.ts";

export function createTState(invalidates:string[]) {
    
    // terminate ttrack if possible
    ttrack.value?.abortController.abort()

    // build tstate, using ttrack.tstate if applicable
    const stateEntries = Object.entries(state)
    const tstateEntries = stateEntries.map(([k, x]) => {
        // if x not signal (stateNonce), return same
        if (!(x instanceof Signal)) return [k, x]
        // if k is in invalidates, invalidate it
        if (invalidates.includes(k)) return [k, undefined]
        // if value is in TTrack'd TState, use that
        const value = ttrack.value?.tstate[k as keyof DAppState]
        if (value) return [k, value]
        // otherwise, use UState value
        return [k, x.value]
    }) as [keyof TState, TState[keyof TState]][]
    const tstate = Object.fromEntries(tstateEntries) as TState
    tstate.stateNonce = getStateNonce()

    // update ttrack, return tstate and abortController
    const abortController = new AbortController()
    ttrack.value = { tstate, abortController }
    return { tstate, abortController }

}