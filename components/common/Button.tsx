import { JSX } from "preact";

export function Button(props:{ addClass?:string }&JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`
      text-2xl
      text-center
      w-[160px]
      shadow-lg
      font-[Poppins]
      rounded-lg
      hover:scale-[102%]
      border
      border-[#e9e9e9]
      dark:border-[#ffffff1f]
      cursor-pointer
      dark:bg-[#191919]
      bg-[#f1f1f1]
      font-light
      z-20
      ${props.addClass}
      `}
    />
  );
}
