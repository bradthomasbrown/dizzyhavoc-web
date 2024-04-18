import {
  getHeight, getDzhvCode/*, getBalance*/
} from "lib/bridge/madness/getters/mod.ts"
import { getDzhvBalance } from "lib/bridge/madness/getters/getDzhvBalance.ts";

export const robinController = { value: new AbortController() }
robinController.value.abort()
export const robinFns = [getHeight, getDzhvCode/*, getBalance*/, getDzhvBalance]
export const robinIndex = { value: 0 }

export function goNext() {
  robinIndex.value = (robinIndex.value + 1) % robinFns.length
  setTimeout(robinFns[robinIndex.value])
}

export function repeat() {
  setTimeout(robinFns[robinIndex.value])
}