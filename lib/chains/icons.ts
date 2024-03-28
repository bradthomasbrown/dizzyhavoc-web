import { Blockie } from '../blockies/Blockie.ts'

export function getIcon(chainId:number):{ dark:string, light:string} {
    switch (chainId) {
        case 11155111: return { dark: '/chains/eth-color.svg', light: 'chains/eth.svg' }
        case 421614: return { dark: '/chains/arb.svg', light: 'chains/arb.svg' }
        case 84532: return { dark: '/chains/base.svg', light: 'chains/base.svg' }
        case 43113: return { dark: '/chains/avax.svg', light: 'chains/avax.svg' }
        case 97: return { dark: '/chains/bsc.svg', light: 'chains/bsc.svg' }
        default: {
            const b64 = new Blockie({ scale: 8, seed: chainId.toString() }).base64()
            return { dark: b64, light: b64 }
        }
    }
}