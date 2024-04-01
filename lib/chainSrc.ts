/**
 * A function that maps chain IDs to image sources
 */
export function chainSrc(chainId: number): { src?: string; dsrc?: string } {
  switch (chainId) {
    case 1:
    case 11155111:
      return { src: "/chains/eth.svg", dsrc: "/chains/eth-color.svg" };
    case 42161:
    case 421614:
      return { src: "/chains/arb.svg" };
    case 56:
    case 97:
      return { src: "/chains/bsc.svg" };
    case 43114:
    case 43113:
      return { src: "/chains/avax.svg" };
    case 8453:
    case 84532:
      return { src: "/chains/base.svg" };
    default:
      return {};
  }
}
