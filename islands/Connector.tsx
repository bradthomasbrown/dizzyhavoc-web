import { JSX } from 'preact'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { Signal } from '@preact/signals'
import { IS_BROWSER } from '$fresh/runtime.ts'
import Button from '../islands/Button.tsx'
import { addresses, connected, provider, state, rpc } from '../utils/mod.ts'
import * as schemas from '../schemas/mod.ts'
import * as e from '../ejra/mod.ts'
import { signal } from '@preact/signals'
import { rlb } from '../../../llc/rlb/mod.ts'

type SignalT<S extends Signal<unknown>> = S extends Signal<infer T> ? T : unknown;

const globalWithEthereum = globalThis as typeof globalThis & {
    ethereum: z.infer<typeof schemas.metamaskProvider> | undefined
}, gwe = globalWithEthereum

// declare global {
//     let ethereum: z.infer<typeof metamaskProviderSchema>
// }
// async function update() {
//     const { ethereum } = globalWithEthereum
//     if (!ethereum) throw new Error('MetaMask not detected') 
//     console.log(ethereum)
// }

let pollId:number
const status:Signal<'Connect'|'Loading...'> = signal('Connect')

function connect() {
    const { ethereum } = gwe
    if (IS_BROWSER && ethereum) {
        // ethereum.on('chainChanged', onChainChanged)
        // ethereum.on('accountsChanged', onAccountsChanged)
        status.value = 'Loading...'
        init()
    }
}

// ### state change flows

// initializing state change flow
// happens when user clicks connect button
async function init() {
    console.log('init')
    // speed up rlb for this flow
    const prevDelay = rlb.delay; rlb.delay = 100
    // create a new temporary state
    const tmp:DAppState = {
        provider: undefined,
        chainId: undefined,
        addresses: undefined,
        height: undefined,
        balance: undefined,
        dzhv: undefined,
        dzhvBalance: undefined,
        rpc: undefined,
        nonce: 0n
    }
    // try to get all dApp state properties until none are undefined 
    while (Object.values(tmp).includes(undefined)) {
        await Promise.all([
            updateProvider(tmp),
            requestAddresses(tmp),
            updateChainId(tmp),
            updateRpc(tmp),
            updateHeight(tmp),
            updateBalance(tmp),
            updateDzhv(tmp),
            updateDzhvBalance(tmp)
        ])
    }
    // slow down rlb after this flow
    rlb.delay = prevDelay
    // start polling loop
    // poll()
    // set user-facing state value (above while loop prevents undefined properties from existing, so casting is okay)
    state.value = { ...tmp } as typeof state.value
}

// async function onChainChanged() {
//     // console.log('onChainChanged')
//     let { provider, nonce, addresses, chainId } = state.value
//     const tmp = { provider, addresses, nonce, chainId }
//     updateProvider(tmp)
//     const prevDelay = rlb.delay; rlb.delay = 100
//     await Promise.all([
//         updateChainId(tmp),
//         updateHeight(tmp),
//         updateNativeBalance(tmp),
//         updateDzhv(tmp)
//         .then(() => updateDzhvBalance(tmp))
//     ])
//     rlb.delay = prevDelay
//     state.value = { ...tmp, nonce: ++nonce }
// }

// async function onAccountsChanged() {
//     console.log('onAccountsChanged')
//     let { provider, nonce, chainId, addresses } = state.value
//     const tmp = { provider, chainId, nonce, addresses }
//     updateProvider(tmp)
//     await updateAddresses(tmp)
//     if (!tmp.addresses?.length) {
//         if (!tmp.addresses?.length) status.value = 'Connect'
//         state.value = { ...tmp, nonce: ++nonce }
//         return
//     }
//     const prevDelay = rlb.delay; rlb.delay = 100
//     await Promise.all([
//         updateHeight(tmp),
//         updateDzhv(tmp)
//         .then(() => Promise.all([
//             updateNativeBalance(tmp),
//             updateDzhvBalance(tmp)
//         ]))
//     ])
//     rlb.delay = prevDelay
//     console.log(tmp.addresses)
//     state.value = { ...tmp, nonce: ++nonce }
// }

// async function poll() {
//     console.log('poll')
//     if (!rpc.value) return
//     let { nonce, chainId, addresses, provider, height } = state.value
//     let tmp = { nonce, chainId, addresses, provider, height }
//     const h = await e.height().call({ url: rpc.value })
//     if (h === height || h === undefined) { pollId = setTimeout(poll, 1000); return }
//     tmp = { ...tmp, height: h }
//     await Promise.all([
//         updateNativeBalance(tmp),
//         updateDzhvBalance(tmp)
//     ]).catch(() => { pollId = setTimeout(poll, 1000); return })
//     if (nonce != state.value.nonce) { pollId = setTimeout(poll, 1000); return }
//     pollId = setTimeout(poll, 0)
//     state.value = { ...tmp, nonce: ++nonce }
// }

// ### state change functions

function updateProvider(tmp:DAppState) {
    if (!gwe.ethereum) { tmp.provider = null; return }
    if (tmp.provider !== undefined) return
    tmp.provider = gwe.ethereum
}

async function requestAddresses(tmp:DAppState) {
    if (tmp.provider === null) { tmp.addresses = null; return }
    if (tmp.provider === undefined || tmp.addresses !== undefined) return
    const result = await tmp.provider.request({ method: 'eth_requestAccounts', params: [] }).catch(() => null)
    tmp.addresses = await z.string().array().parseAsync(result).catch(() => null)
}

async function updateAddresses(tmp:DAppState) {
    if (tmp.provider === null) { tmp.addresses = null; return }
    if (tmp.provider === undefined || tmp.addresses !== undefined) return
    const result = await tmp.provider.request({ method: 'eth_accounts', params: [] }).catch(() => null)
    tmp.addresses = await z.string().array().parseAsync(result).catch(() => null)
}

async function updateChainId(tmp:DAppState) {
    if (tmp.provider === null) { tmp.chainId = null; return }
    if (tmp.provider === undefined || tmp.chainId !== undefined) return
    const result = await tmp.provider.request({ method: 'eth_chainId', params: [] }).catch(() => null)
    tmp.chainId = await z.string().transform(BigInt).parseAsync(result).catch(() => null)
}

function updateRpc(tmp:DAppState) {
    if (tmp.chainId === undefined || tmp.rpc !== undefined) return
    switch (tmp.chainId) {
        case 1n: tmp.rpc = 'https://eth.llamarpc.com'; break
        case 56n: tmp.rpc = 'https://binance.llamarpc.com'; break
        case 8453n: tmp.rpc = 'https://base.llamarpc.com'; break
        case 42161n: tmp.rpc = 'https://arbitrum.llamarpc.com'; break
        case 43114n: tmp.rpc = 'https://avalanche.drpc.org'; break
        default: tmp.rpc = null
    }
}

async function updateHeight(tmp:DAppState) {
    if (tmp.rpc === null) { tmp.height = null; return }
    if (tmp.rpc === undefined || tmp.height !== undefined) return
    tmp.height = await e.height().call({ url: tmp.rpc }).catch(() => null)
}

async function updateBalance(tmp:DAppState) {
    if (tmp.rpc === null || tmp.addresses === null || tmp.height === null) { tmp.balance = null; return }
    const address = tmp.addresses?.at(0)
    if (address === undefined || tmp.rpc === undefined || tmp.height === undefined || tmp.balance !== undefined) return
    tmp.balance = await e.balance({ address, tag: tmp.height }).call({ url: tmp.rpc }).catch(() => null)
}

async function updateDzhv(tmp:DAppState) {
    if (tmp.rpc === null || tmp.height === null) { tmp.dzhv = null; return }
    if (tmp.rpc === undefined || tmp.height === undefined || tmp.dzhv !== undefined) return
    const code = await e.code({ address: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe' }).call({ url: tmp.rpc }).catch(() => null)
    if (code === '0x' || code === null) { tmp.dzhv = null; return }
    tmp.dzhv = { address: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe' }
}

async function updateDzhvBalance(tmp:DAppState) {
    if (tmp.rpc === null || tmp.addresses === null || tmp.height === null || tmp.dzhv === null) { tmp.dzhvBalance = null; return }
    const address = tmp.addresses?.at(0)
    if (address === undefined || tmp.rpc === undefined || tmp.height === undefined || tmp.dzhv === undefined || tmp.dzhvBalance !== undefined) return
    const input = `0x70a08231${address.substring(2).padStart(64, '0')}`
    const maybeBalanceStr = await e.call({ tx: { input, to: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe' }, tag: tmp.height }).call({ url: tmp.rpc }).catch(() => null)
    if (maybeBalanceStr === null) { tmp.dzhvBalance = null; return }
    tmp.dzhvBalance = await z.string().transform(BigInt).parseAsync(maybeBalanceStr).catch(() => null)
}

export default function Foo(
    props: JSX.HTMLAttributes<HTMLButtonElement>
) {
    return (
        <div>
            {!state.value.addresses?.at(0) && (<div>
                <Button onClick={connect}>{status.value}</Button>
            </div>)}
        </div>
    );
}