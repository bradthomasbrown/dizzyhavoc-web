import { Balance } from "islands/bridge/control/from/Balance.tsx"
import { Input } from "islands/bridge/control/from/Input.tsx"
import { Slip } from "islands/bridge/control/from/Slip.tsx"

export const From = Object.assign(
  function () {
    return (
      <div class="grid grid-rows-[auto,1fr] grid-cols-[auto,1fr]">
        <Balance />
        <Input/>
        <Slip/>
        {
          /* 
        <div class="row-start-3 col-start-1 col-span-2 w-64 h-8">
          <Percents/>
        </div>
        <div class="row-start-4 col-start-1 col-span-2 w-64 h-8">
          <Dollars/>
        </div>
        <div class="row-start-1 col-start-3 col-span-1 w-16 h-8">
          "From"
        </div>
        <div class="row-start-2 col-start-3 col-span-1 w-16 h-12">
          <Abrv/>
        </div>
        <div class="row-start-3 col-start-3 row-span-2 w-16 h-16">
          <ChainPicker/>
        </div> */
        }
      </div>
    );
  },
  {}
)
