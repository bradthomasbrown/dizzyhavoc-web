import { Signal } from "@preact/signals";
import { Chain } from "lib/faucet/madness/query/types/Chain.ts";
import { JSX } from "preact/jsx-runtime";
import { P6963 } from "lib/getProviders.tsx";
import { FaucetData } from 'lib/faucet/madness/getters/getFaucetData.ts'

export const state = {
  p6963: new Signal<undefined | P6963>(),
  which: new Signal<null | JSX.Element>(null),
  chainMap: new Map<number, Chain>(),
  codeMap: new Map<number, boolean>(),
  active: new Signal<number[]>([]),
  accounts: new Signal<string[]>([]),
  account: new Signal<undefined | string>(),
  recipient: new Signal<undefined | string>(),
  chainId: new Signal<undefined | number>(),
  chain: new Signal<undefined | Chain>(),
  rpc: new Signal<undefined | string>(),
  height: new Signal<undefined | bigint>(),
  lastHeight: new Signal<undefined | bigint>(),
  dzhvCode: new Signal<undefined | string>(),
  dzhv: new Signal<undefined | { address: string }>(),
  dzhvBalance: new Signal<undefined | bigint>(),
  dollars: new Signal<undefined | string>(),
  faucetData: new Signal<undefined | FaucetData>(),
  loading: {
    chain: new Signal<string>("unload-[]"),
    rpc: new Signal<string>("unload-[]"),
    height: new Signal<string>("unload-[]"),
    dzhvCode: new Signal<string>("unload-[]"),
    dzhv: new Signal<string>("unload-[]"),
    dzhvBalance: new Signal<string>("unload-[]"),
  faucetData: new Signal<string>("unload-[]"),
  },
};
