import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal, batch, computed, signal } from "@preact/signals";
import { rlb } from "../../../../llc/rlb/RLB.ts";
import { updateAddresses, updateProvider, updateChainId, updateRpc, updateHeight,
    updateBalance, updateDzhv, updateDzhvBalance, state, TState, DAppState, Button, e } from "../../lib/internal.ts";
    import { getStateNonce } from "../../lib/internal.ts";
    import { InjectedProvider } from "../../lib/internal.ts";

const status:Signal<'Connect'|'Loading'|'Connected'> = signal('Connect')

const globalWithEthereum = globalThis as typeof globalThis & {
    ethereum?: InjectedProvider
}, gwe = globalWithEthereum

function connect() {
    const { ethereum } = gwe
    if (IS_BROWSER && ethereum) {
        // ethereum.on('chainChanged', onChainChanged)
        // ethereum.on('accountsChanged', onAccountsChanged)
        status.value = 'Loading'
        init()
    }
}

async function init() {
    // speed up rpc calls for init
    const prevDelay = rlb.delay; rlb.delay = 333
    // tstate in init is equal to state with all values set to undefined and new stateNonce
    const tstate = { ...Object.fromEntries(Object.entries(state).map(([k]) => [k, undefined])), stateNonce: getStateNonce() } as TState
    // using an object where pieces of state are properties allows easy iteration
    while (Object.values(tstate).includes(undefined)) {
        await Promise.all([
            updateProvider(tstate),
            updateAddresses(tstate, { type: 'req' }),
            updateChainId(tstate),
            updateRpc(tstate),
            updateHeight(tstate),
            updateBalance(tstate),
            updateDzhv(tstate),
            updateDzhvBalance(tstate)
        ])
        console.log(JSON.stringify(Object.entries(tstate).map(([k,v]) => [k,!!v])))
    }
    // slow down rpc calls after init
    rlb.delay = prevDelay
    // if tstate contains null values, there was an issue determining dApp state, log error and prompt to try again
    if (Object.values(tstate).includes(null)) {
        const nullEntries = Object.entries(tstate).filter(([k,v]) => v === null)
        const nullKeys = nullEntries.map(([k]) => k)
        console.error(new Error(`failed to initialize dApp, try connecting again. could not acquire keys: ${JSON.stringify(nullKeys)}`))
        return
    }
    // if tstate nonce <= ustate nonce, then don't update. this could happen if a user clicked "Connect", then immediately changed chains or accounts
    if (tstate.stateNonce <= state.stateNonce) return
    // update state signals and stateNonce. state object is the same, all signals update in a batch
    batch(() => {
        const stateSignals = Object.entries(state).filter(([_,v]) => v instanceof Signal) as [keyof DAppState, Signal][]
        for (const [key, signal] of stateSignals) signal.value = tstate[key]
        state.stateNonce = tstate.stateNonce
        status.value = 'Connected'
    })
    poll()
}

async function poll() {
    while (true) {
        console.log('POLL')
        // tstate in poll is equal to state with all values set to undefined and stateNonce set to 1
        // createTState()
        const { stateNonce, ...signals } = state
        const tstate = {
            ...Object.fromEntries(Object.entries(signals).map(([k,sig])=>[k,sig.value])),
            balance: undefined, dzhvBalance: undefined,
            stateNonce: getStateNonce()
        } as TState
        if (!tstate.rpc) { console.error(new Error(`cannot poll, tstate.rpc missing`)); return }
        const height = await e.height().call({ url: tstate.rpc }).catch(() => null)
        if (height === null) { console.error(new Error(`error polling, height null from rpc ${tstate.rpc}`)); continue }
        if (!tstate.height || height <= tstate.height) continue
        // using an object where pieces of state are properties allows easy iteration
        // speed up rpc calls for updates
        // updateTState()
        const prevDelay = rlb.delay; rlb.delay = 333
        while (Object.values(tstate).includes(undefined)) {
            await Promise.all([
                updateBalance(tstate),
                updateDzhvBalance(tstate)
            ])
        }
        // slow down rpc calls after updates
        rlb.delay = prevDelay
        // commitTState()
        // if tstate contains null values, there was an issue determining dApp state, log error and prompt to try again
        if (Object.values(tstate).includes(null)) {
            const nullEntries = Object.entries(tstate).filter(([k,v]) => v === null)
            const nullKeys = nullEntries.map(([k]) => k)
            console.error(new Error(`failed to poll, trying again. could not acquire keys: ${JSON.stringify(nullKeys)}`))
            continue
        }
        // if tstate nonce <= ustate nonce, then don't update. this could happen if a user clicked "Connect", then immediately changed chains or accounts
        if (tstate.stateNonce <= state.stateNonce) continue
        batch(() => {
            const stateSignals = Object.entries(state).filter(([_,v]) => v instanceof Signal) as [keyof DAppState, Signal][]
            for (const [key, signal] of stateSignals) signal.value = tstate[key]
            state.stateNonce = tstate.stateNonce
        })
    }
}

export function Connector() {

    const connected = computed(() => !!state.addresses.value?.[0])

    return (
        <Button
            addClass="text-2xl shadow-xl"
            onClick={connected.value ? ()=>{} : connect}
        >
            {status}
        </Button>
    );
}