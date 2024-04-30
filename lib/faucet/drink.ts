import { state } from "lib/faucet/state.ts";
import { dzhv } from "lib/faucet/madness/dzhv.ts";

export function drink() {

  const p6963 = state.p6963.value
  const from = state.account.value
  const faucetData = state.faucetData.value
  if (!p6963 || !from || !faucetData) return
  const [_divider, fee] = faucetData

  const to = dzhv.address
  const value = `0x${fee.toString(16)}`
  const data = '0x1a9bbe59'
  const tx = { from, to, data, value }
  const { provider } = p6963
  provider.request({ method: 'eth_sendTransaction', params: [tx] })
  
}