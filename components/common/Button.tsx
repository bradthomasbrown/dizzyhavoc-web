import { Signal } from "@preact/signals";
import { JSX } from "preact";

type ButtonProps = {
  disabled?:Signal<boolean>
  textSize?:Signal<undefined|string>
}

export function Button(
  props:ButtonProps
    & Omit<JSX.HTMLAttributes<HTMLDivElement>,'disabled'>,
) {
  const { disabled, textSize, onClick } = props
  return (
    <div
      onClick={e => disabled?.value ? ()=>{} : onClick?.(e) }
      class={`
        w-40 h-10
        select-none
        ${textSize?.value ?? 'text-2xl'}
        flex items-center justify-center
        font-light
        shadow-lg rounded-lg
        ${disabled?.value ? '' : 'hover:scale-[102%] active:scale-[98%]'}
        ${disabled?.value
          ? 'brightness-90'
          : `hover:brightness-95 active:brightness-110
            dark:hover:brightness-105 dark:active:brightness-90`}
        border border-[#e9e9e9] dark:border-[#ffffff1f]
        ${disabled?.value ? 'cursor-auto' : 'cursor-pointer'}
        dark:bg-[#191919] bg-[#f1f1f1]
      `}
    >
      {props.children}
    </div>
  );
}
