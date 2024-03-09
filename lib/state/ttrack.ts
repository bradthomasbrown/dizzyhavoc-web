import { Signal } from "@preact/signals";
import { DAppState } from "../internal.ts";

type TTrack = Signal<{
    tstate:DAppState
    abortController:AbortController
}|undefined>

export const ttrack:TTrack = new Signal(undefined)