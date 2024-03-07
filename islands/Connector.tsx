import { JSX } from 'preact'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { Signal } from '@preact/signals'
import { IS_BROWSER } from '$fresh/runtime.ts'
import Button from '../islands/Button.tsx'
import { addresses, connected, provider, state, rpc, DAppState } from '../utils/mod.ts'
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
const status:Signal<'Connect'|'Loading'> = signal('Connect')

function connect() {
    const { ethereum } = gwe
    if (IS_BROWSER && ethereum) {
        // ethereum.on('chainChanged', onChainChanged)
        // ethereum.on('accountsChanged', onAccountsChanged)
        status.value = 'Loading'
        init()
    }
}

// ### state change flows

// initializing state change flow
// happens when user clicks connect button
async function init() {
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
    const table:Array<DAppState&{ step:string }> = [{ step: 'init', ...tmp }]
    // try to get all dApp state properties until none are undefined 
    while (Object.values(tmp).includes(undefined)) {
        await Promise.all([
            updateProvider({ tmp, table }),
            requestAddresses({ tmp, table }),
            updateChainId({ tmp, table }),
            updateRpc({ tmp, table }),
            updateHeight({ tmp, table }),
            updateBalance({ tmp, table }),
            updateDzhv({ tmp, table }),
            updateDzhvBalance({ tmp, table })
        ])
    }
    // slow down rlb after this flow
    rlb.delay = prevDelay
    // start polling loop
    poll()
    // check if temp state has errors, then log which data is in error. only commit state if n o errors
    if (Object.values(tmp).includes(null)) console.error('null data', Object.entries(tmp).filter(([_k,v]) => v === null).map(([k,_v]) => k))
    else {
        console.table(table)
        state.value = { ...tmp } as typeof state.value
    }
}

async function poll() {
    while (true) {
        const tmp:DAppState = { ...state.value, balance: undefined, dzhvBalance: undefined }
        const table:Array<DAppState&{ step:string }> = [{ step: 'poll', ...tmp }]
        // need a timeout here since we can't rely on RLB to stop us from infinite looping with no delay
        if (!tmp.rpc) { await new Promise(r => setTimeout(r, 1000)); continue }
        const height = await e.height().call({ url: tmp.rpc }).catch(() => null)
        if (height === tmp.height || height === null) continue
        tmp.height = height
        while (Object.values(tmp).includes(undefined)) {
            await Promise.all([
                updateBalance({ tmp, table }),
                updateDzhvBalance({ tmp, table })
            ])
        }
        if (tmp.nonce != state.value.nonce) continue
        if (Object.values(tmp).includes(null)) console.error('null data', Object.entries(tmp).filter(([_k,v]) => v === null).map(([k,_v]) => k))
        else {
            console.table(table, ['step', 'height', 'balance', 'dzhvBalance'])
            state.value = { ...tmp, nonce: (tmp.nonce as bigint) + 1n }
        }
    }
}

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

// ### state change functions

function updateProvider({ tmp, table }:{ tmp:DAppState, table:Array<DAppState&{ step:string }> }) {
    if (!gwe.ethereum) { tmp.provider = null; return }
    if (tmp.provider !== undefined) return
    tmp.provider = gwe.ethereum
    table.push({ step: 'updateProvider', ...tmp })
}

async function requestAddresses({ tmp, table }:{ tmp:DAppState, table:Array<DAppState&{ step:string }> }) {
    if (tmp.provider === null) { tmp.addresses = null; return }
    if (tmp.provider === undefined || tmp.addresses !== undefined) return
    const result = await tmp.provider.request({ method: 'eth_requestAccounts', params: [] }).catch(() => null)
    tmp.addresses = await z.string().array().parseAsync(result).catch(() => null)
    table.push({ step: 'requestAddresses', ...tmp })
}

async function updateAddresses({ tmp, table }:{ tmp:DAppState, table:Array<DAppState&{ step:string }> }) {
    if (tmp.provider === null) { tmp.addresses = null; return }
    if (tmp.provider === undefined || tmp.addresses !== undefined) return
    const result = await tmp.provider.request({ method: 'eth_accounts', params: [] }).catch(() => null)
    tmp.addresses = await z.string().array().parseAsync(result).catch(() => null)
    table.push({ step: 'updateAddresses', ...tmp })
}

async function updateChainId({ tmp, table }:{ tmp:DAppState, table:Array<DAppState&{ step:string }> }) {
    if (tmp.provider === null) { tmp.chainId = null; return }
    if (tmp.provider === undefined || tmp.chainId !== undefined) return
    const result = await tmp.provider.request({ method: 'eth_chainId', params: [] }).catch(() => null)
    tmp.chainId = await z.string().transform(BigInt).parseAsync(result).catch(() => null)
    table.push({ step: 'updateChainId', ...tmp })
}

function updateRpc({ tmp, table }:{ tmp:DAppState, table:Array<DAppState&{ step:string }> }) {
    if (tmp.chainId === undefined || tmp.rpc !== undefined) return
    switch (tmp.chainId) {
        case 1n: tmp.rpc = 'https://eth.llamarpc.com'; break
        case 56n: tmp.rpc = 'https://binance.llamarpc.com'; break
        case 8453n: tmp.rpc = 'https://base.llamarpc.com'; break
        case 42161n: tmp.rpc = 'https://arbitrum.llamarpc.com'; break
        case 43114n: tmp.rpc = 'https://avalanche.drpc.org'; break
        case 84532n: tmp.rpc = 'https://sepolia.base.org'; break
        default: { tmp.rpc = null; console.error(`unknown chainId ${tmp.chainId}`) }
    }
    table.push({ step: 'updateRpc', ...tmp })
}

async function updateHeight({ tmp, table }:{ tmp:DAppState, table:Array<DAppState&{ step:string }> }) {
    if (tmp.rpc === null) { tmp.height = null; return }
    if (tmp.rpc === undefined || tmp.height !== undefined) return
    tmp.height = await e.height().call({ url: tmp.rpc }).catch(() => null)
    table.push({ step: 'updateHeight', ...tmp })
}

async function updateBalance({ tmp, table }:{ tmp:DAppState, table:Array<DAppState&{ step:string }> }) {
    if (tmp.rpc === null || tmp.addresses === null || tmp.height === null) { tmp.balance = null; return }
    const address = tmp.addresses?.at(0)
    if (address === undefined || tmp.rpc === undefined || tmp.height === undefined || tmp.balance !== undefined) return
    tmp.balance = await e.balance({ address, tag: tmp.height }).call({ url: tmp.rpc }).catch(() => null)
    table.push({ step: 'updateBalance', ...tmp })
}

async function updateDzhv({ tmp, table }:{ tmp:DAppState, table:Array<DAppState&{ step:string }> }) {
    if (tmp.rpc === null || tmp.height === null) { tmp.dzhv = null; return }
    if (tmp.rpc === undefined || tmp.height === undefined || tmp.dzhv !== undefined) return
    const code = await e.code({ address: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe' }).call({ url: tmp.rpc }).catch(() => null)
    if (code === '0x' || code === null) { tmp.dzhv = null; return }
    tmp.dzhv = { address: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe' }
    table.push({ step: 'updateDzhv', ...tmp })
}

async function updateDzhvBalance({ tmp, table }:{ tmp:DAppState, table:Array<DAppState&{ step:string }> }) {
    if (tmp.rpc === null || tmp.addresses === null || tmp.height === null || tmp.dzhv === null) { tmp.dzhvBalance = null; return }
    const address = tmp.addresses?.at(0)
    if (address === undefined || tmp.rpc === undefined || tmp.height === undefined || tmp.dzhv === undefined || tmp.dzhvBalance !== undefined) return
    const input = `0x70a08231${address.substring(2).padStart(64, '0')}`
    const maybeBalanceStr = await e.call({ tx: { input, to: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe' }, tag: tmp.height }).call({ url: tmp.rpc }).catch(() => null)
    if (maybeBalanceStr === null) { tmp.dzhvBalance = null; return }
    tmp.dzhvBalance = await z.string().transform(BigInt).parseAsync(maybeBalanceStr).catch(() => null)
    table.push({ step: 'updateDzhvBalance', ...tmp })
}

export default function Foo() {
    return (
        <div>
            {!state.value.addresses?.at(0) && (<div>
                <div className="text-2xl text-[#3d3d3d] shadow-xl font-[monospace] rounded-lg py-1 px-4 hover:scale-[105%] cursor-pointer bg-[#c5c5c5]" onClick={connect}>{status.value}</div>
            </div>)}
            {state.value.addresses?.at(0) && (<div>
                <div className="text-2xl text-[#3d3d3d] shadow-xl font-[monospace] rounded-lg py-1 px-4 hover:scale-[105%] cursor-pointer bg-[#c5c5c5]">Connected</div>
            </div>)}
        </div>
    );
}