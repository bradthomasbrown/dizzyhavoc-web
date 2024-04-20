import { FaucetLink } from "components/bridge/mod.ts";
import { ActionButton, Control, Height, Active, Code } from "islands/bridge/mod.ts";

export function Form() {
  return (
    <div class="select-none flex flex-col items-center gap-2">
      <Control.From />
      <ActionButton />
      <Height />
      <div class="absolute top-1 right-1 flex flex-col text-sm font-mono w-full gap-2">
        <Active />
        <Code />
      </div>
      <FaucetLink />
    </div>
  );
}
