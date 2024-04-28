import {
  getHeight, getDzhvCode, getDzhvBalance, getDexscreener
} from "lib/bridge/madness/getters/mod.ts"
import * as viRobin from "lib/bridge/madness/viRobin.ts"

export const robinController = { value: new AbortController() }
robinController.value.abort()
export const robinFns = [viRobin.run, getDexscreener, getHeight, getDzhvCode, getDzhvBalance]
export const robinIndex = { value: 0 }
let timeout:undefined|number = undefined

export function start() {
  if (robinController.value.signal.aborted)
    robinController.value = new AbortController()
  run()
}

export function abort() {
  try { robinController.value.abort() } catch (_) {_}
  clearTimeout(timeout)
}

function run() {
  // console.log(robinFns[robinIndex.value])
  timeout = setTimeout(robinFns[robinIndex.value])
}

export function restart() {
  robinIndex.value = 0
  start()
}

export function goNext() {
  robinIndex.value = (robinIndex.value + 1) % robinFns.length
  run()
}