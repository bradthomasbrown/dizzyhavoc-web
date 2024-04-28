import { Input } from "islands/bridge/control/to/Input.tsx";
import { Dollars } from "islands/bridge/control/to/Dollars.tsx";
import { FhChainPicker } from "islands/common/FhChainPicker.tsx";
import { state } from "lib/state.ts";

export function To() {
  return (
    <div class="grid grid-rows-[36px,28px] grid-cols-[192px,64px]">
      <Input />
      <Dollars />
      <div class="row-start-1 col-start-2 row-span-2">
        <FhChainPicker chainIdSignal={state.to.chainId} title={"To"} />
      </div>
    </div>
  );
}
