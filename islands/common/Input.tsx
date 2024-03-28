import { JSX } from "preact/jsx-runtime";

export function Input(
  props: JSX.DOMAttributes<HTMLInputElement> & { clearClick: boolean },
) {
  return (
    <input
      class={`
          bg-[#f2f2f2]
          dark:bg-[#1e1e1e]
          rounded-lg
          m-4
          px-2
          lg:text-lg
          text-[#2c2c2c]
          dark:text-[#EAEAEA]
          border
          dark:border-1
          border-1
          border-[#2c2c2c2a]
          dark:border-[#eaeaea2a]
          font-mono
      `}
      onClick={props.clearClick
        ? (e) => e.currentTarget.value = ""
        : props.onClick}
      onInput={props.onInput}
    />
  );
}
