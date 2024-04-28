import { Signal } from "@preact/signals";
import { Chain } from "lib/bridge/madness/query/types/Chain.ts";
import { DexscreenerData } from "lib/bridge/madness/getters/getDexscreener.ts";
import { JSX } from "preact/jsx-runtime";
import { EconConf } from "lib/vertinfo/types/mod.ts";
import { P6963 } from "lib/getProviders.tsx";

export const state = {
  slippage: new Signal<number>(5),
  slippage64: new Signal<bigint>(BigInt(Math.floor((2 ** 64 - 1) * 5))),
  lastViGet: -Infinity,
  p6963: new Signal<undefined | P6963>(),
  which: new Signal<null | JSX.Element>(null),
  chainMap: new Map<number, Chain>(),
  codeMap: new Map<number, boolean>(),
  active: new Signal<number[]>([]),
  econConf: new Signal<undefined | EconConf>(),
  dexscreener: new Signal<undefined | DexscreenerData>(),
  accounts: new Signal<string[]>([]),
  account: new Signal<undefined | string>(),
  recipient: new Signal<undefined | string>(),
  from: {
    chainId: new Signal<undefined | number>(),
    chain: new Signal<undefined | Chain>(),
    rpc: new Signal<undefined | string>(),
    height: new Signal<undefined | bigint>(),
    lastHeight: new Signal<undefined | bigint>(),
    dzhvCode: new Signal<undefined | string>(),
    dzhv: new Signal<undefined | { address: string }>(),
    dzhvBalance: new Signal<undefined | bigint>(),
    dollars: new Signal<undefined | string>(),
    input: {
      type: new Signal<undefined | "number" | "percent" | "slip">(),
      bigint: new Signal<undefined | bigint>(),
      string: new Signal<undefined | string>(),
      percent: new Signal<undefined | number>(),
      slip: new Signal<boolean>(false),
    },
  },
  to: {
    chainId: new Signal<undefined | number>(),
    dollars: new Signal<undefined | string>(),
    input: {
      bigint: new Signal<undefined | bigint>(),
      string: new Signal<undefined | string>(),
    },
  },
  loading: {
    active: new Signal<string>("unload-[]"),
    econConf: new Signal<string>("unload-[]"),
    dexscreener: new Signal<string>("unload-[]"),
    from: {
      chain: new Signal<string>("unload-[]"),
      rpc: new Signal<string>("unload-[]"),
      height: new Signal<string>("unload-[]"),
      dzhvCode: new Signal<string>("unload-[]"),
      dzhv: new Signal<string>("unload-[]"),
      dzhvBalance: new Signal<string>("unload-[]"),
      dollars: new Signal<undefined | string>(),
    },
    to: {
      dollars: new Signal<undefined | string>(),
    },
  },
};
