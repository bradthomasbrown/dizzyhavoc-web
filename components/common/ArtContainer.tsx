import { JSX } from "preact/jsx-runtime";

export function ArtContainer(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      class={`
        select-none
        z-[-1]
        w-full h-full
        absolute
        flex justify-center items-center`
      }
    >
      {props.children}
    </div>
  );
}
