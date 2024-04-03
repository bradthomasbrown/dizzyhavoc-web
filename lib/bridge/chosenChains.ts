
import * as chainlist from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.3/mod.ts'
import { Signal } from "@preact/signals";
import { viVortex } from './viVortex/viVortex.ts'

export const chosenChains = new Map([
  ['from', new Signal<undefined|chainlist.types.Chain>(undefined)],
  ['to', new Signal<undefined|chainlist.types.Chain>(undefined)]
])

chosenChains.get('to')!.subscribe(() => viVortex?.flow('econConfCheck'))