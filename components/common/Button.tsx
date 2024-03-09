import { JSX } from "preact";

export function Button(props:{ addClass?:string }&JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`
        text-xl
      text-[#3d3d3d]
        shadow-lg
        font-[Poppins]
        rounded-lg
        py-1
        px-4
        hover:scale-[105%]
        border
      border-[#e9e9e9]
        cursor-pointer
      bg-[#f1f1f1]
        ${props.addClass}
      `}
    />
  );
}