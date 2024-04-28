import { batch } from "@preact/signals";
import { Connector, ConnectorState } from "islands/common/mod.ts";
import { state } from "lib/state.ts";

export function WhichCancel({ onCancel }: { onCancel?: () => void }) {
  function onClick() {
    batch(() => {
      state.which.value = null;
      Connector.set(ConnectorState.READY);
    });
    onCancel?.();
  }

  return (
    <svg
      class={`
        w-6 h-6
        top-2 left-2
        absolute
        cursor-pointer
        hover:scale-[105%] active:scale-[98%]`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      onClick={onClick}
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 12h14M5 12l4-4m-4 4 4 4"
      />
    </svg>
  );
}
