import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal, batch, signal } from "@preact/signals";
import { rlb } from "../../../llc/rlb/RLB.ts";
import { DAppState, state, statuses } from "../lib/utils/state.ts";
import * as schemas from '../lib/schemas/mod.ts'
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import * as e from '../lib/ejra/mod.ts'

const bar = e.receipt({ hash: '' }).ejrrq.schema

const globalWithEthereum = globalThis as typeof globalThis & {
    ethereum: z.infer<typeof schemas.metamaskProvider> | undefined
}, gwe = globalWithEthereum

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
    const tmp = { ...state.value }
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
        const hashesWhereStatusNull = [...statuses.entries()].filter(([_, status]) => !status.value).map(([hash]) => hash) 
        const receipts:z.infer<typeof bar>[] = []
        for (const hash of hashesWhereStatusNull) receipts.push(await e.receipt({ hash }).call({ url: tmp.rpc }).catch(() => null))
        if (tmp.nonce != state.value.nonce) continue
        if (Object.values(tmp).includes(null)) console.error('null data', Object.entries(tmp).filter(([_k,v]) => v === null).map(([k,_v]) => k))
        else {
            console.table(table, ['step', 'height', 'balance', 'dzhvBalance'])
            batch(() => {
                state.value = { ...tmp, nonce: (tmp.nonce as bigint) + 1n }
                for (const receipt of receipts.filter(receipt => receipt && receipt.blockNumber <= height)) {
                    if (!receipt) continue
                    const status = statuses.get(receipt.transactionHash)
                    if (!status) continue
                    status.value = receipt.status
                }
            })
        }
    }
}

// // ### state change functions

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
        case 8545n: tmp.rpc = 'http://localhost:8545'; break
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
                <div className="text-2xl text-[#3d3d3d] shadow-xl font-[Poppins] rounded-lg py-1 px-4 hover:scale-[105%] border border-[#e9e9e9] cursor-pointer bg-[#f1f1f1]" onClick={connect}>{status.value}</div>
            </div>)}
            {state.value.addresses?.at(0) && (<div>
                <div className="text-2xl text-[#3d3d3d] shadow-xl font-[Poppins] rounded-lg py-1 px-4 hover:scale-[105%] border border-[#e9e9e9] cursor-pointer bg-[#f1f1f1]">Connected</div>
            </div>)}
        </div>
    );
}
