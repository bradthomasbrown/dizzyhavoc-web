import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.0.1/mod.ts'
import { loading, state } from "lib/bridge/madness/dzkv.ts";
import { toad } from "lib/bridge/madness/ejra/ejra.ts";
import { Snail } from "lib/mod.ts";
import { robinController, goNext } from "lib/bridge/madness/robin.ts";
import "lib/dzkvInit.ts"

export async function getActive() {

  // get signal, if aborted return
  const { signal } = robinController.value
  if (signal.aborted) return

  // 🐌
  const lazy = () => fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'get_activeChains',
      params: {},
      id: 0
    } satisfies jra.types.RequestO),
    signal
  })
  const snail = new Snail({ lazy, signal })
  toad.feed(snail).catch(() => {})
  await snail.born
  loading('active')!.value = 'loading-[#80ffff2b]'
  const response = await snail.died.catch((e:Error) => e)
  if (response instanceof Error) return goNext()
  const active = await response
    .json()
    .then(jra.schema.response.parse)
    .then(response => response.result)
    .catch((e:Error) => e) as Error|number[]
  loading('active')!.value = 'unload-[]'

  // update state if not error and there is a difference
  if (
    !(active instanceof Error)
    && String(state<number[]>('active')!.value) != String(active)
  ) state<number[]>('active')!.value = active

  // goNext
  return goNext()

}