import { CurrencyPair } from "./CurrencyPair.tsx";
import { ActionButton } from "../../islands/bridge/ActionButton.tsx";
import { Flipper } from "./Flipper.tsx";
import { RecipientInput } from "../../islands/bridge/RecipientInput.tsx";

export function BridgeForm() {
  return (
    <div class="flex flex-col items-center gap-2">
      {/* <Details/> */}
      <CurrencyPair />
      <Flipper />
      <RecipientInput />
      <ActionButton />
      <a
        class="absolute bottom-0 left-0 ml-1 text-md font-[Poppins] hover:scale-[102%]"
        target="_blank"
        href="/faucet"
      >
        💧testnet faucet
      </a>
    </div>
  );
}
