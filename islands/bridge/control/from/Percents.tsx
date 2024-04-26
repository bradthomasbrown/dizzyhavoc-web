import { Button } from "components/common/mod.ts";
import { Signal, computed } from "@preact/signals";
import { Slip } from "islands/bridge/control/from/Slip.tsx";
import { state } from "lib/state.ts";

function PercentButton(props: { percent: number }) {
  const { percent } = props;
  const active = computed(() =>
    state.from.input.type.value == 'percent'
    && state.from.input.percent.value == percent
  )
  return (
    <Button
      active={active}
      width="w-full"
      height="h-full"
      textSize={new Signal("text-xs")}
      weight="font-extralight"
      onClick={() => {
        state.from.input.type.value = 'percent'
        state.from.input.percent.value = percent
      }}
    >
      {percent}%
    </Button>
  );
}

const buttons = [25, 50, 75, 100].map((percent, i) => {
  return <PercentButton percent={percent} />;
});
buttons.unshift(<Slip/>);

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
