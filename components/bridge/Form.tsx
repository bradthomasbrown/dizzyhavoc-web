import { FaucetLink, FromInput } from "components.bridge";
// import { CurrencyPair } from "./CurrencyPair.tsx";
import { ActionButton } from "islands.bridge";
// import { Flipper } from "./Flipper.tsx";
// import { RecipientInput } from "../../islands/bridge/RecipientInput.tsx";

export function Form() {
  return (
    <div class="select-none flex flex-col items-center gap-2">
      <FromInput />
      {
        /* <Flipper/>
      <ToInput/> */
      }
      <ActionButton />
      <FaucetLink />
    </div>
  );
}
