import { JSX } from 'preact'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { IS_BROWSER } from '$fresh/runtime.ts'
import { addresses, connected, provider } from '../utils/mod.ts'
import * as schemas from '../schemas/mod.ts'

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

async function connect() {
    const { ethereum } = gwe
    if (!ethereum) { alert('Metamask not detected!'); return }
    provider.value = ethereum
    await provider.value.request({ method: 'eth_requestAccounts', params: [] }).then((as:string[]) => addresses.value = as)
    connected.value = true
    provider.value.on('accountsChanged', (as:string[]) => { connected.value = !!as.length; addresses.value = as })
}

export default function Foo(
    props: JSX.HTMLAttributes<HTMLButtonElement>
) {
    return (
        <div>
            {!connected.value && (<div>
                <button onClick={connect}>connect</button>
            </div>)}
        </div>
    );
}