export function chainSrc(chainId:number):{ src?:string, dsrc?:string } {
  switch(chainId) {
    case 11155111: return { src: '/chains/eth.svg', dsrc: '/chains/eth-color.svg' }
    case 421614: return { src: '/chains/arb.svg' }
    case 97: return { src: '/chains/bsc.svg' }
    case 43113: return { src: '/chains/avax.svg' }
    case 84532: return { src: '/chains/base.svg' }
    default: return {}
  }
}