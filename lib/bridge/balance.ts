import { Signal, effect } from "@preact/signals";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { dzkv, ejra } from 'lib'
import 'lib.bridge'

const addressesKey = ['addresses', 'p6963']
const fromChainKey = ['chains', 'from']

type AddressesSignal = Signal<string[]>
type ChainSignal = Signal<null|Chain>
type BigintSignal = Signal<null|bigint>

dzkv.ensure<AddressesSignal>(addressesKey, new Signal([]))
dzkv.ensure<ChainSignal>(fromChainKey, new Signal(null))

effect(async () => {

  // get dependencies
  const chain = dzkv.get<ChainSignal>(fromChainKey)!.value
  const url = chain?.rpc.at(0)
  const address = dzkv.get<AddressesSignal>(addressesKey)!.value.at(0)
  if (!chain || !url || !address) return
  // create height key and ensure height signal exists for this chain
  const heightKey = ['heights', chain]
  dzkv.ensure<BigintSignal>(heightKey, new Signal(null))
  // get the height, logging error if it exists
  const height = dzkv.get<BigintSignal>(heightKey)!.value
  if (!height) return

  // get balance
  const input = `0x70a08231${address.slice(2).padStart(64, '0')}`
  const to = '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe'
  const balance = await ejra.call(url, { input, to }, height)
    .then(z.instanceof(Error).or(z.string().transform(BigInt)).parseAsync)
    .catch((reason:Error) => reason)
  if (balance instanceof Error) return

  const balanceKey = ['balances', chain, 'dzhv']
  if (!dzkv.ensure<BigintSignal>(balanceKey, new Signal(balance)))
    dzkv.get<BigintSignal>(balanceKey)!.value = balance

  console.log({ height, balanceKey, balance })

})