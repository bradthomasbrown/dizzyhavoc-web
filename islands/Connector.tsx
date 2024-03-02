import { JSX } from 'preact'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { Signal } from '@preact/signals'
import { IS_BROWSER } from '$fresh/runtime.ts'
import Button from '../islands/Button.tsx'
import { addresses, connected, provider, state } from '../utils/mod.ts'
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

async function connect() {
    // provider.value = gwe.ethereum
    // if (!provider.value) { alert('Metamask not detected!'); return }
    // await provider.value.request({ method: 'eth_requestAccounts', params: [] }).then((as:string[]) => addresses.value = as)
    // connected.value = true
    // provider.value.on('accountsChanged', (as:string[]) => { connected.value = !!as.length; addresses.value = as })
    // init()
    const { ethereum } = gwe
    if (IS_BROWSER && ethereum) {
        ethereum.on('chainChanged', onChainChanged)
        ethereum.on('accountsChanged', onAccountsChanged)
        status.value = 'Loading...'
        await init()
    }
}

async function init() {
    console.log('init')
    const tmp = { provider: gwe.ethereum, ...state.value }
    updateProvider(tmp)
    const prevDelay = rlb.delay
    rlb.delay = 100
    await requestAddresses(tmp)
    await Promise.all([
        updateChainId(tmp),
        updateHeight(tmp),
        updateDzhv(tmp)
        .then(() => Promise.all([
            updateDzhvBalance(tmp),
            updateNativeBalance(tmp)
        ]))
    ])
    rlb.delay = prevDelay
    pollId = setTimeout(poll, 1000)
    state.value = { ...tmp }
}

async function onChainChanged() {
    // console.log('onChainChanged')
    let { provider, nonce, addresses } = state.value
    const tmp = { provider, addresses, nonce }
    updateProvider(tmp)
    await Promise.all([
        updateChainId(tmp),
        updateHeight(tmp),
        updateNativeBalance(tmp),
        updateDzhv(tmp)
        .then(() => updateDzhvBalance(tmp))
    ])
    state.value = { ...tmp, nonce: ++nonce }
}

async function onAccountsChanged() {
    console.log('onAccountsChanged')
    let { provider, nonce, chainId, addresses } = state.value
    const tmp = { provider, chainId, nonce, addresses }
    updateProvider(tmp)
    await updateAddresses(tmp)
    if (!tmp.addresses?.length) {
        if (!tmp.addresses?.length) status.value = 'Connect'
        state.value = { ...tmp, nonce: ++nonce }
        return
    }
    await Promise.all([
        updateHeight(tmp),
        updateDzhv(tmp)
        .then(() => Promise.all([
            updateNativeBalance(tmp),
            updateDzhvBalance(tmp)
        ]))
    ])
    console.log(tmp.addresses)
    state.value = { ...tmp, nonce: ++nonce }
}

async function poll() {
    console.log('poll')
    let { nonce, chainId, addresses, provider, height } = state.value
    let tmp = { nonce, chainId, addresses, provider, height }
    const h = await e.height().call({ url: 'https://eth.llamarpc.com' })
    if (h === height || h === undefined) { pollId = setTimeout(poll, 1000); return }
    tmp = { ...tmp, height: h }
    await Promise.all([
        updateNativeBalance(tmp),
        updateDzhvBalance(tmp)
    ]).catch(() => { pollId = setTimeout(poll, 1000); return })
    if (nonce != state.value.nonce) { pollId = setTimeout(poll, 1000); return }
    pollId = setTimeout(poll, 0)
    state.value = { ...tmp, nonce: ++nonce }
}

async function updateChainId(tmp:SignalT<typeof state>) {
    tmp.chainId = await e.chainId().call({ url: 'https://eth.llamarpc.com' })
    // console.log('updateChainId', tmp)
}

async function requestAddresses(tmp:SignalT<typeof state>) {
    console.log('requestAddresses start', tmp)
    const { provider } = tmp
    if (!provider) return
    tmp.addresses = await provider.request({ method: 'eth_requestAccounts', params: [] })
    console.log('requestAddresses end', tmp)
}

async function updateAddresses(tmp:SignalT<typeof state>) {
    console.log('updateAddresses', tmp)
    const { provider } = tmp
    if (!provider) return
    tmp.addresses = await provider.request({ method: 'eth_accounts', params: [] })
}

function updateProvider(tmp:SignalT<typeof state>) {
    tmp.provider = gwe.ethereum
    console.log('updateProvider', tmp)
}

async function updateHeight(tmp:SignalT<typeof state>) {
    tmp.height = await e.height().call({ url: 'https://eth.llamarpc.com' })
    console.log('updateHeight', tmp)
}

async function updateNativeBalance(tmp:SignalT<typeof state>) {
    const address = tmp.addresses?.at(0)
    if (!address) return
    tmp.balance = BigInt(await e.balance({ address }).call({ url: 'https://eth.llamarpc.com' }))
    console.log('updateNativeBalance', tmp)
}

async function updateDzhv(tmp:SignalT<typeof state>) {
    const code = await e.code({ address: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe' }).call({ url: 'https://eth.llamarpc.com' })
    tmp.dzhv = { address: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe' }
    console.log('updateDzhv', tmp)
}

async function updateDzhvBalance(tmp:SignalT<typeof state>) {
    const address = tmp.addresses?.at(0)
    if (!address) return
    const input = `0x70a08231${address.substring(2).padStart(64, '0')}`
    tmp.dzhvBalance = BigInt(await e.call({ tx: { input, to: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe' } }).call({ url: 'https://eth.llamarpc.com' }))
    console.log('updateDzhvBalance', tmp)
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