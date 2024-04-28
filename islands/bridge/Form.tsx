import { FaucetLink } from "components/bridge/mod.ts";
import {
  ActionButton,
  Active,
  Code,
  Control,
  Height,
  SettingsCog,
} from "islands/bridge/mod.ts";
import { Flipper } from "components/bridge/Flipper.tsx";
import { Recipient } from "islands/bridge/Recipient.tsx";
import { hidden } from "islands/bridge/BridgeButton.tsx";

export function Form() {
  return (
    <>
      <div
        class={`
          ${hidden.value ? "hidden" : ""}
          absolute
          grow
          w-full h-full
          bg-[#19191960]
          z-20
        `}
      />
      <div class="select-none flex flex-col items-center gap-2">
        <SettingsCog />
        <Control.From />
        <Flipper />
        <Control.To />
        <Recipient />
        <ActionButton />
        <Height />
        <div class="absolute top-1 right-1 flex flex-col text-sm font-mono w-full gap-2">
          <Active />
          <Code />
        </div>
        <FaucetLink />
      </div>
    </>
  );
}
