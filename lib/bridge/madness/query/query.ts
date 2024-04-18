import { Snail } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/snail@0.0.3/mod.ts";
import { Toad } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/toad@0.0.10/mod.ts";
import * as schemas from './schema/mod.ts'
export function query(toad:Toad, chainId:number, signal?:AbortSignal) {

  const lazy = async () => await fetch(
    `https://cdn.jsdelivr.net/gh/ethereum-lists/chains/_data/chains/eip155-${chainId}.json`,
    { signal }
  )
    .then(response => response.json())
    .then(schemas.chain.parseAsync)

  // 🐌
  const snail = new Snail({ lazy, signal })
  toad.feed(snail).catch(() => {})
  return snail

}