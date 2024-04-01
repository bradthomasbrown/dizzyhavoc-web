import { JSX } from "preact/jsx-runtime";

export function Input(
  props: JSX.DOMAttributes<HTMLInputElement> & { clearClick?: boolean },
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
          border
          dark:border-1
          border-1
          border-[#2c2c2c2a]
          dark:border-[#eaeaea2a]
          font-mono
      `}
      onClick={e => {
        if (props.clearClick) e.currentTarget.value = ""
        props.onClick?.(e)
      }}
      onInput={props.onInput}
    />
  );
}
