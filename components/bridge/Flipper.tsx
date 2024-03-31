import { JSX } from "preact/jsx-runtime";

export function Flipper(props:JSX.DOMAttributes<SVGElement>) {
  return (
    <svg
      onClick={props.onClick}
      class="z-10 absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] [hover:scale-[105%] active:scale-[95%] cursor-pointer w-8 h-8"
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
  )
}