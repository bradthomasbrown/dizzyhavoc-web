import { FaucetLink } from "components/bridge/mod.ts";
import { ActionButton, Control, Height } from "islands/bridge/mod.ts";

export function Form() {
  return (
    <div class="select-none flex flex-col items-center gap-2">
      <Control.From />
      <ActionButton />
      <Height />
      <FaucetLink />
    </div>
  );
}
