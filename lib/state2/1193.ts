import z from 'https://deno.land/x/zod@v3.22.4/index.ts'

type Tx = {
    from?:string
    to?:string
    data?:string
    value?:bigint
}

export const p1193 = z.object({
    request: z.function().args(z.object({ method: z.string(), params: z.unknown().array() })).returns(z.unknown().promise()),
    on: z.function().args(z.string(), z.function().args(z.any()).returns(z.void()))
})

const metaMaskProvider = p1193.and(z.object({
    isMetaMask: z.literal(true)
}))

const trustWalletProvider = p1193.and(z.object({
    isTrust: z.literal(true)
}))

export type P1193 = z.infer<typeof p1193>

type MetaMaskProvider = z.infer<typeof metaMaskProvider>

type TrustWalletProvider = z.infer<typeof trustWalletProvider>

type G1193 = typeof globalThis & { ethereum?:P1193|MetaMaskProvider } & { trustwallet?:TrustWalletProvider }

export function getG1193():G1193 { return globalThis }

export const wp1193 = {

    async send(tx:Tx):Promise<Error|string> {
        const g1193 = getG1193()
        if (!g1193.ethereum) return new Error('no eip-1193 provider detected')
        const p1193:P1193 = g1193.ethereum
        return await p1193.request({ method: 'eth_sendTransaction', params: [tx] })
            .then(z.string().parseAsync)
            .catch(reason => new Error(reason))
    },

    async chainId():Promise<Error|bigint> {
        const g1193 = getG1193()
        if (!g1193.ethereum) return new Error('no eip-1193 provider detected')
        const p1193:P1193 = g1193.ethereum
        return await p1193.request({ method: 'eth_chainId', params: [] })
            .then(z.string().transform(BigInt).parseAsync)
            .catch(reason => new Error(reason))
    },
    
    async requestAddresses():Promise<Error|string[]> {
        const g1193 = getG1193()
        if (!g1193.ethereum) return new Error('no eip-1193 provider detected')
        const p1193:P1193 = g1193.ethereum
        return await p1193.request({ method: 'eth_requestAccounts', params: [] })
            .then(z.string().array().parseAsync)
            .catch(reason => new Error(String(reason)))
    },
    
    async addresses():Promise<Error|string[]> {
        const g1193 = getG1193()
        if (!g1193.ethereum) return new Error('no eip-1193 provider detected')
        const p1193:P1193 = g1193.ethereum
        return await p1193.request({ method: 'eth_accounts', params: [] })
            .then(z.string().array().parseAsync)
            .catch(reason => new Error(reason))
    },

    onChainChanged(listener:(chainId:string) => void):Error|P1193 {
        const g1193 = getG1193()
        if (!g1193.ethereum) return new Error('no eip-1193 provider detected')
        const p1193:P1193 = g1193.ethereum
        p1193.on('chainChanged', listener)
        return g1193.ethereum
    },

    onAccountsChanged(listener:(accounts:string[]) => void):Error|P1193 {
        const g1193 = getG1193()
        if (!g1193.ethereum) return new Error('no eip-1193 provider detected')
        const p1193:P1193 = g1193.ethereum
        p1193.on('accountsChanged', listener)
        return g1193.ethereum
    }

}