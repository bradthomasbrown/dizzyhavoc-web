import { DAppState } from '../internal.ts'

export type UpdaterOpts = {
    tState:DAppState
    signal?:AbortSignal
}