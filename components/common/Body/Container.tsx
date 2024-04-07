import { JSX } from "preact/jsx-runtime";

/**
 * The container for the body and its title
 */
export function Container(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`
      min-w-[360px] sm:min-w-[500px]
      min-h-[25rem]
      flex flex-col
      bg-blur2 shadow-xl rounded-xl
      my-auto`}
    >
      {props.children}
    </div>
  );
}
