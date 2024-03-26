import { Signal } from "@preact/signals";
import { InjectedProvider } from '../internal.ts'

type DAppState = {
    provider:undefined|InjectedProvider|Error,
    addresses:undefined|string[]|Error,
    rpc:undefined|string|Error,
    height:undefined|bigint|Error,
    balance:undefined|bigint|Error,
    chainId:undefined|bigint|Error,
    dzhvBalance:undefined|bigint|Error,
    dzhv:undefined|{ address:string }|Error,
    stateNonce:bigint
}

type TState = DAppState
type UState = { [P in keyof DAppState]: P extends 'stateNonce' ? bigint : Signal<DAppState[P]> }

export type { TState, UState, DAppState }