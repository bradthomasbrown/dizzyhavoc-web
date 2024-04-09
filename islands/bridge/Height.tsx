import { Signal } from "@preact/signals";

type HeightProps = { display: Signal<string>; loading: Signal<string> };

const dispHeight = new Signal("0");
const loading = new Signal("");

function _Height({ display, loading }: HeightProps) {
  return (
    <div
      class={`
        select-none
        absolute bottom-1 right-1
        border border-transparent
        px-1
        rounded-xl
        text-sm
        font-mono
        ${loading}
      `}
    >
      {display}
    </div>
  );
}

export function Height() {
  const display = new Signal("0");
  const loading = new Signal("");
  const signals = { display, loading };

  const height = <_Height {...{ ...signals }} />;

  return Object.assign(height, signals);
}
