import { DAppState, TState } from "../internal.ts";

export async function updateTState({
    tstate, updaters, abortController
}:{
    tstate:TState,
    updaters:Array<
        ({ tstate, abortController }:{
            tstate:DAppState, abortController:AbortController
        }) => Promise<void>
    >
    abortController:AbortController
}) {
    while (Object.values(tstate).includes(undefined)) {
        await Promise.all(updaters.map(updater => updater({
            tstate, abortController })))
    }
} 