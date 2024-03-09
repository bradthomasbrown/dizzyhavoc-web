import { Signal } from "@preact/signals";
import { TState, state, getStateNonce } from '../internal.ts'

export function createTState(invalidates:string[]) {
    const stateEntries = Object.entries(state)
    const tstateEntries = stateEntries.map(([k, x]) => {
        if (!(x instanceof Signal)) return [k, x]
        if (invalidates.includes(k)) return [k, undefined]
        const { value } = x
        return [k, value]
    }) as [keyof TState, TState[keyof TState]][]
    const tstate = Object.fromEntries(tstateEntries) as TState
    tstate.stateNonce = getStateNonce()
    return tstate
}