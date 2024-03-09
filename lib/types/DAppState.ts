import { Signal } from "@preact/signals";
import { InjectedProvider } from '../internal.ts'

type DAppState = {
    provider:undefined|InjectedProvider|null,
    addresses:undefined|string[]|null,
    rpc:undefined|string|null,
    height:undefined|bigint|null,
    balance:undefined|bigint|null,
    chainId:undefined|bigint|null,
    dzhvBalance:undefined|bigint|null,
    dzhv:undefined|{ address:string }|null,
    stateNonce:bigint
}

type TState = DAppState
type UState = { [P in keyof DAppState]: P extends 'stateNonce' ? bigint : Signal<DAppState[P]> }

export type { TState, UState, DAppState }