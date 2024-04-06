import { FaucetLink, FromInput } from "components/bridge/mod.ts";
// import { CurrencyPair } from "./CurrencyPair.tsx";
import { ActionButton } from "islands/bridge/mod.ts";
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
