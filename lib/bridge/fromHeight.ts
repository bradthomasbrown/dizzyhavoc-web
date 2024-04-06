import { Signal, effect } from "@preact/signals";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import { dzkv, ejra } from 'lib'
import 'lib.bridge'

const fromChainKey = ['chains', 'from']

type ChainSignal = Signal<null|Chain>
type HeightSignal = Signal<null|bigint>
type SymbolSignal = Signal<symbol>

dzkv.ensure<ChainSignal>(fromChainKey, new Signal(null))

effect(async () => {

  // get dependencies
  const chain = dzkv.get<ChainSignal>(fromChainKey)!.value
  const url = chain?.rpc.at(0)
  if (!chain || !url) return

  // ensure ping signal exists, noop access its value to add as dependency
  const symbolKey = ['heights', chain, 'symbol']
  dzkv.ensure<SymbolSignal>(symbolKey, new Signal(Symbol()))
  dzkv.get<SymbolSignal>(symbolKey)!.value

  // get height, returning if error, setting an immediate timeout to ping
  const height = await ejra.height(url)
  if (height instanceof Error) { console.error(height); return }
  setTimeout(() => dzkv.get<SymbolSignal>(symbolKey)!.value = Symbol(), 0)

  // update height if its greater than the previous height
  const fromHeightKey = ['heights', chain]
  dzkv.ensure<HeightSignal>(fromHeightKey, new Signal(null))
  const prevHeight = dzkv.get<HeightSignal>(fromHeightKey)!.value
  if (!prevHeight || height > prevHeight) {
    console.log({ prevHeight, height })
    dzkv.get<HeightSignal>(fromHeightKey)!.value = height
  }

})