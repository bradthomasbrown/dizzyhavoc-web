import { JSX } from "preact";

export function Button(
  props: { addClass?: string, rounding?:string, wiggle?:boolean } & JSX.HTMLAttributes<HTMLDivElement>,
) {
  if (props.disabled) props.wiggle = false
  return (
    <div
      {...props}
      className={`
      select-none
      text-2xl
      text-center
      ${props.width ? props.width : "w-[160px]"}
      shadow-lg
      font-[Poppins]
      ${props.rounding ?? "rounded-lg"}
      ${props.wiggle ? "hover:scale-[102%]" : ""}
      ${props.wiggle ? "active:scale-[98%]" : ""}
      ${props.disabled ? "contrast-[75%]" : ""}
      hover:brightness-95
      active:brightness-110
      dark:hover:brightness-105
      dark:active:brightness-90
      border
      border-[#e9e9e9]
      dark:border-[#ffffff1f]
      ${props.disabled ? "cursor-not-allowed" : "cursor-pointer"}
      dark:bg-[#191919]
      bg-[#f1f1f1]
      font-light
      z-20
      ${props.addClass}
      `}
    />
  );
}
