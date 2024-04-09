import { Balance } from "islands/bridge/control/from/Balance.tsx";
import { Input } from "islands/bridge/control/from/Input.tsx";
import { Percents } from "islands/bridge/control/from/Percents.tsx";
import { Dollars } from "islands/bridge/control/from/Dollars.tsx";

export function From() {
  const balance = Balance();

  const from = (
    <div class="grid grid-rows-[auto,1fr] grid-cols-[auto,1fr]">
      {balance}
      {
        /* <Input/>
      <Dollars/>
      <Percents/> */
      }
      {
        /*
      <div class="row-start-3 col-start-3 row-span-2 w-16 h-16">
        <ChainPicker/>
      </div>
      */
      }
    </div>
  );

  return Object.assign(from, { balance });
}
