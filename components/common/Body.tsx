import { JSX } from "preact/jsx-runtime";

/**
 * The Body of the app where art and interactables are usually located
 */
export function Body(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`
        relative
        w-[360px] sm:w-[500px]
        h-[500px] min-h-[25rem] max-h-[500px] 
        bg-blur2 shadow-xl rounded-xl
        flex flex-col justify-center items-center
        overflow-hidden
      `}
    >
      {props.children}
    </div>
  );
}
