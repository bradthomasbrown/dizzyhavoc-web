import { JSX } from 'preact'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { IS_BROWSER } from '$fresh/runtime.ts'
import { connected } from '../utils/connected.ts'
import { addrs } from '../utils/addrs.ts'

const metamaskProviderSchema = z.object({
    isMetaMask: z.literal(true),
    request: z.function().args(z.object({ method: z.string(), params: z.unknown().array() })).returns(z.string().array().promise()),
    on: z.function(),
    selectedAddress: z.string().nullable()
})

const globalWithEthereum = globalThis as typeof globalThis & {
    ethereum: z.infer<typeof metamaskProviderSchema> | undefined
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
    await ethereum.request({ method: 'eth_requestAccounts', params: [] }).then((as:string[]) => addrs.value = as)
    connected.value = true
    ethereum.on('accountsChanged', (as:string[]) => { connected.value = !!as.length; addrs.value = as })
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