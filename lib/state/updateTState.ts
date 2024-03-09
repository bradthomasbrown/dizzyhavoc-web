import { rlb } from "../../../../llc/rlb/mod.ts";
import { DAppState, TState } from "../internal.ts";

export async function updateTState(
    tstate:TState,
    updaters:((state:DAppState)=>Promise<void>)[]
) {
    const prevDelay = rlb.delay
    while (Object.values(tstate).includes(undefined))
        await Promise.all(updaters.map(updater => updater(tstate)))
    rlb.delay = prevDelay
} 