import { rpc, UState, provider, addresses, chainId, dzhv, balance, dzhvBalance,
    height } from '../internal.ts'

// the user-displayed state, or UState
// take all state signals and add them to an object
const state:UState = { provider, addresses, rpc, chainId, dzhv, balance,
    dzhvBalance, height, stateNonce: 0n }

export { state }