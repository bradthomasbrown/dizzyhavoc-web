import { Button } from "components/common/mod.ts";
import { Signal } from "@preact/signals";
import { Slip } from "islands/bridge/control/from/Slip.tsx";
import * as slip from "islands/bridge/control/from/Slip.tsx";
import { dzkv } from "lib/dzkv.ts";

if(!dzkv.get<Signal<number>>(['control', 'from', 'percentValue']))
  dzkv.set(['control', 'from', 'percentValue'], new Signal(0))

if (!dzkv.get<Signal<string>>(['control', 'from', 'inputType']))
  dzkv.set(['control', 'from', 'inputType'], new Signal('number'))

function PercentButton(props: { percent: number; active: Signal<boolean> }) {
  const { percent, active } = props;
  return (
    <Button
      active={active}
      width="w-full"
      height="h-full"
      textSize={new Signal("text-xs")}
      weight="font-extralight"
      onClick={() => {
        slip.signal.value = 0;
        dzkv.get<Signal<string>>(['control', 'from', 'inputType'])!.value = 'percent';
        dzkv.get<Signal<number>>(['control', 'from', 'percentValue'])!.value = percent;
        deactivate();
        active.value = true;
      }}
    >
      {percent}%
    </Button>
  );
}

export const signals = Array(5).fill(0).map(() => new Signal(false));

export function deactivate() {
  for (const signal of signals) signal.value = false;
}

const buttons = [25, 50, 75, 100].map((percent, i) => {
  return <PercentButton percent={percent} active={signals[i]} />;
});
buttons.unshift(<Slip active={signals[4]} />);

export function Percents() {
  return (
    <div
      class={`
      row-start-4 col-start-1 col-span-2
      w-48 h-8
      pt-1
      px-1
      grid grid-cols-5 gap-1
      items-center
    `}
    >
      {buttons}
    </div>
  );
}
