import { dzkv } from "lib/dzkv.ts"
import { Signal } from '@preact/signals-core'

export function loading(datum:string) {
  return dzkv.get<Signal<string>>(['loading', datum])
}

export function state<T>(datum:string) {
  return dzkv.get<Signal<undefined|T>>(['state', datum])
}