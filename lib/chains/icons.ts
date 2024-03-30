import { Blockie } from "../blockies/Blockie.ts";

function getB64Icon(seed:string) {
  const b64 = new Blockie({ scale: 8, seed }).base64()
  return { dark: b64, light: b64 }
}

export function getIcon(thing: unknown): { dark: string; light: string } {
  if (
    typeof thing == 'object'
    && thing !== null &&
    'chainId' in thing
    && typeof thing.chainId == 'number'
  ) {
    switch (thing.chainId) {
      case 11155111:
        return { dark: "/chains/eth-color.svg", light: "chains/eth.svg" };
      case 421614:
        return { dark: "/chains/arb.svg", light: "chains/arb.svg" };
      case 84532:
        return { dark: "/chains/base.svg", light: "chains/base.svg" };
      case 43113:
        return { dark: "/chains/avax.svg", light: "chains/avax.svg" };
      case 97:
        return { dark: "/chains/bsc.svg", light: "chains/bsc.svg" };
      default:
          return getB64Icon(thing.chainId.toString())
    }
  }
  return getB64Icon((Math.random() * Number.MAX_SAFE_INTEGER).toString())
}
