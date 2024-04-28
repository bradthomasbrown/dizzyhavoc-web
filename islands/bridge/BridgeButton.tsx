import { Button } from "components/common/Button.tsx";
import { computed, Signal } from "@preact/signals";
import { state } from "lib/state.ts";
import { dzhv } from "lib/bridge/madness/dzhv.ts";
import { Gate } from "lib/bridge/madness/ejra/ejra.ts";

const disabled = computed(() => {
  if (
    !state.to.input.bigint.value ||
    !state.recipient.value ||
    !state.recipient.value.match(/^0x[0-9a-f]{40}$/i)
  ) return true;
  return false;
});

export const hidden = new Signal(true);

const acknowledgeGate = new Signal<Gate<void>>(new Gate<void>());
function acknowledge() {
  acknowledgeGate.value.resolve();
}
function cancel() {
  acknowledgeGate.value.reject("cancelled");
}

async function promptSlippageWarning() {
  hidden.value = false;
  acknowledgeGate.value = new Gate<void>();
  await acknowledgeGate.value.promise
    .finally(() => hidden.value = true);
}

async function bridge() {
  const p6963 = state.p6963.value;
  const from = state.account.value;
  const dest = state.to.chainId.value;
  const amount = state.from.input.bigint.value;
  const recipient = state.recipient.value;
  const chain = state.from.chain.value;
  const slippage = state.slippage64.value;
  if (
    !p6963 || !from || !recipient || !chain ||
    dest === undefined || amount === undefined || slippage === undefined
  ) return;

  const eDestChainId = dest.toString(16).padStart(64, "0");
  const eRecipient = recipient.slice(2).padStart(64, "0");
  const eAmount = amount.toString(16).padStart(64, "0");
  const eSlippage = slippage.toString(16).padStart(64, "0");
  const data = `0x6d55a4ee${eDestChainId}${eRecipient}${eAmount}${eSlippage}`;
  const to = dzhv.address;
  const tx = { from, to, data };
  const { provider } = p6963;
  const hexChainId = `0x${chain.chainId.toString(16)}`;

  if (
    Number(state.to.input.string.value) <
      Number(state.from.input.string.value) *
        (1 - state.slippage.value / 100)
  ) {
    await promptSlippageWarning()
      .catch(() => {
        throw new Error("user declined bridge");
      });
  }

  const switchChain = async () => {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{
        chainId: hexChainId,
      }],
    });
  };

  const addChain = async () => {
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: hexChainId,
        blockExplorerUrls: chain.explorers.map(({ url }) => url),
        chainName: chain.name,
        nativeCurrency: chain.nativeCurrency,
        rpcUrls: chain.rpc,
      }],
    });
  };

  await switchChain().catch((e: { code: number }) =>
    e.code == 4902 ? addChain().then(switchChain) : {}
  );

  provider.request({ method: "eth_sendTransaction", params: [tx] });
}

export function BridgeButton() {
  return (
    <>
      <Button disabled={disabled} onClick={bridge}>Bridge</Button>
      <div
        class={`
          ${hidden.value ? "hidden" : ""}
          max-w-[75%] sm:max-w-[90%]
          absolute
          flex flex-col gap-1
          items-center
          bg-[#ededed] dark:bg-[#191919]
          shadow-xl rounded-xl
          p-2
          top-1/2
          -translate-y-1/2
          z-30
        `}
      >
        <div>⚠️ WARNING ⚠️</div>
        <div>
          Trade slippage ({Math.round(
            100 *
              (1 -
                Number(state.to.input.string.value) /
                  Number(state.from.input.string.value)),
          )}%) exceeds specified slippage ({state.slippage.value}%). This bridge
          might never complete. To continue, press 'Continue' below.
        </div>
        <div class="flex gap-2 flex-wrap-reverse justify-center">
          <Button onClick={acknowledge}>Continue</Button>
          <Button onClick={cancel}>Cancel</Button>
        </div>
      </div>
    </>
  );
}
