import { Signal } from "@preact/signals";

type BalanceProps = { display: Signal<string>; loading: Signal<string> };

function _Balance({ display, loading }: BalanceProps) {
  return (
    <div
      class={`
        row-start-1 col-start-1 col-span-2 w-48 h-6
        flex items-center
        font-mono
        brightness-75
      `}
    >
      <div
        class={`
        flex items-center
        max-w-48
        px-2
        rounded-full border border-transparent
        ${loading}
      `}
      >
        <div class="mr-1 text-xs">Balance:</div>
        <div class="overflow-hidden overflow-ellipsis">{display}</div>
        <div class="ml-2 select-none text-xs">DZHV</div>
      </div>
    </div>
  );
}

export function Balance() {
  const display = new Signal("0");
  const loading = new Signal("");
  const signals = { display, loading };

  const balance = <_Balance {...{ ...signals }} />;

  return Object.assign(balance, signals);
}
