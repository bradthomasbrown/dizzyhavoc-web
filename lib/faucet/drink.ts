import { ejra } from "../../lib/faucet/ejra.ts";
import { evmVortex } from "../../lib/faucet/evmVortex/evmVortex.ts";

export async function drink(){
    const addresses = evmVortex.uState.addresses.value;
    const rpc = evmVortex.uState.rpc.value;
    const p1193 = evmVortex.uState.p1193.value;
    const chain = evmVortex.uState.chain.value;
  
    if (!addresses || addresses instanceof Error) {
      alert("no selected address");
      return;
    }
    if (!rpc || rpc instanceof Error) {
      alert("no rpc");
      return;
    }
    if (!p1193 || p1193 instanceof Error) {
      alert("no provider");
      return;
    }
  
    const result = await ejra.call(rpc, {
      to: "0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe",
      input: "0x762ebebc",
    }, "latest");
    if (result instanceof Error) {
      alert(result);
      return;
    }
    const [divider, fee] =
      result.slice(2).match(/.{64}/g)?.map((s) => BigInt(`0x${s}`)) ?? [];
    if (!divider || !fee) {
      alert(
        `could not find faucet on chain ${chain}, make sure you are connected to a valid testnet (Sepolia ETH/BASE/ARB, tBSC, AVAX Fuji)`,
      );
      return;
    }
  
    const from = addresses[0];
    const to = "0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe";
    const value = `0x${fee.toString(16)}`;
    const data = "0x1a9bbe59";
  
    const tx = { from, to, value, data };

    await p1193.request({ method: "eth_sendTransaction", params: [tx] });
}