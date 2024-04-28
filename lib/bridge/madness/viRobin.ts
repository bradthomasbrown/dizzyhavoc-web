import { getActive } from "lib/bridge/madness/getters/getActive.ts";
import { getEconConf } from "lib/bridge/madness/getters/getEconConf.ts";

const robinFns = [getActive, getEconConf];
const robinIndex = { value: 0 };

export function run() {
  setTimeout(robinFns[robinIndex.value]);
}

export function increment() {
  robinIndex.value = (robinIndex.value + 1) % robinFns.length;
}
