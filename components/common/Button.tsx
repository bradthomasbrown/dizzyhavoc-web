import { Signal } from "@preact/signals";
import { JSX } from "preact";

type ButtonProps = {
  disabled?: Signal<boolean>;
  textSize?: Signal<undefined | string>;
  weight?: string;
  width?: string;
  height?: string;
  active?: Signal<boolean>;
};

export function Button(
  props:
    & ButtonProps
    & Omit<JSX.HTMLAttributes<HTMLDivElement>, "disabled">,
) {
  const { active, weight, width, height, disabled, textSize, onClick } = props;
  return (
    <div
      onClick={(e) => disabled?.value ? () => {} : onClick?.(e)}
      class={`
        ${width ?? "w-40"} ${height ?? "h-10"}
        select-none
        ${textSize?.value ?? "text-2xl"}
        flex items-center justify-center
        ${weight ?? "font-light"}
        shadow-lg rounded-lg
        ${
        active?.value
          ? "scale-[98%] brightness-110 dark:brightness-90"
          : `${disabled?.value ? "" : "hover:scale-[102%] active:scale-[98%]"}
              ${
            disabled?.value
              ? "brightness-90"
              : `hover:brightness-95 active:brightness-110
                    dark:hover:brightness-105 dark:active:brightness-90`
          }`
      }
        border border-[#e9e9e9] dark:border-[#ffffff1f]
        ${disabled?.value ? "cursor-auto" : "cursor-pointer"}
        dark:bg-[#191919] bg-[#f1f1f1]
      `}
    >
      {props.children}
    </div>
  );
}
