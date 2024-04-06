import { Signal, effect } from "@preact/signals";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import { dzkv } from 'lib'

const p6963ChainKey = ['chains', 'p6963']
const pickedFromChainKey = ['chains', 'picked', 'from']
const fromChainKey = ['chains', 'from']

type ChainSignal = Signal<null|Chain>

dzkv.ensure<ChainSignal>(p6963ChainKey, new Signal(null))
dzkv.ensure<ChainSignal>(pickedFromChainKey, new Signal(null))
dzkv.ensure<ChainSignal>(fromChainKey, new Signal(null))

effect(() => {
  const p6963Chain = dzkv.get<ChainSignal>(p6963ChainKey)!.value
  const pickedFromChain = dzkv.get<ChainSignal>(pickedFromChainKey)!.value
  console.log({ p6963Chain, pickedFromChain })
  dzkv.get<ChainSignal>(fromChainKey)!.value = pickedFromChain ?? p6963Chain
})

// dzkv.get<ChainSignal>(fromChainKey)!.subscribe(fromChain => console.log({ fromChain }))