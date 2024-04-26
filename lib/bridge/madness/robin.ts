import {
  getHeight, getDzhvCode, getActive, getDzhvBalance, getDexscreener
} from "lib/bridge/madness/getters/mod.ts"
import { getEconConf } from "lib/bridge/madness/getters/getEconConf.ts";

export const robinController = { value: new AbortController() }
robinController.value.abort()
export const robinFns = [getActive, getEconConf, getDexscreener, getHeight, getDzhvCode, getDzhvBalance]
export const robinIndex = { value: 0 }

export function start() {
  if (robinController.value.signal.aborted)
    robinController.value = new AbortController()
  run()
}

export function abort() {
  try { robinController.value.abort() } catch (_) {_}
}

function run() {
  // console.log(robinFns[robinIndex.value])
  setTimeout(robinFns[robinIndex.value])
}

export function restart() {
  robinIndex.value = 0
  start()
}

export function goNext() {
  robinIndex.value = (robinIndex.value + 1) % robinFns.length
  run()
}