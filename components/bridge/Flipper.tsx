import { chosenChains } from "../../lib/bridge/chosenChains.ts";

function flip() {
  const { from, to } = chosenChains.value;
  chosenChains.value = { from: to, to: from };
}

export function Flipper() {
  return (
    <div class="order-2 h-0">
      <svg
        onClick={flip}
        class="hover:scale-[105%] active:scale-[95%] cursor-pointer w-8 h-8 z-10 translate-y-[-50%]"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
        />
      </svg>
    </div>
  );
}
