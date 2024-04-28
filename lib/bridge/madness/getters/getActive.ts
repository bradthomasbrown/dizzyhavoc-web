import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.0.6/mod.ts'
import { toad } from "lib/bridge/madness/ejra/ejra.ts";
import { Snail } from "lib/mod.ts";
import { robinController, goNext } from "lib/bridge/madness/robin.ts";
import { increment } from 'lib/bridge/madness/viRobin.ts'
import { state } from "lib/state.ts";

export async function getActive() {

  // get signal, if aborted return
  const { signal } = robinController.value
  if (signal.aborted) return

  // wait between gets for api data
  if (Date.now() - state.lastViGet < 1000) return goNext()

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
  if (signal.aborted) return
  state.loading.active.value = 'loading-[#80ffff2b]'
  const response = await snail.died.catch((e:Error) => e)
  if (signal.aborted) return
  if (response instanceof Error) return goNext()
  const active = await response
    .json()
    .then(jra.schema.response.parse)
    .then(response => response.result)
    .catch((e:Error) => e) as Error|number[]
  if (signal.aborted) return
  state.loading.active.value = 'unload-[]'

  // update state if not error and there is a difference
  if (!(active instanceof Error)) {
    if (state.to.chainId.value !== undefined) increment()
    state.lastViGet = Date.now()
    if (String(state.active.value) != String(active))
      state.active.value = active
  }

  // goNext
  return goNext()

}