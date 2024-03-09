import { DAppState } from '../internal.ts'

export type UpdaterOpts = {
    tstate:DAppState
    signal?:AbortSignal
}