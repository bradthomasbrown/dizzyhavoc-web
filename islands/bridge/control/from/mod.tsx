import { Balance } from "islands/bridge/control/from/Balance.tsx";
import { Input } from "islands/bridge/control/from/Input.tsx";
import { Percents } from "islands/bridge/control/from/Percents.tsx";
import { Dollars } from "islands/bridge/control/from/Dollars.tsx";
import { FhChainPicker } from 'islands/common/FhChainPicker.tsx'

export function From() {
  return (
    <div class="grid grid-rows-[24px,40px,28px,36px] grid-cols-[192px,64px]">
      <Balance/>
      <Input/>
      <Dollars/>
      <Percents/>
      <div class="row-start-3 col-start-2 row-span-2">
        <FhChainPicker dzkvKey={['control', 'from', 'chain']} title={'From'} />
      </div>
    </div>
  );
}
