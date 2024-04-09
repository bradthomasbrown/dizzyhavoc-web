import { JSX } from "preact/jsx-runtime";
import { Container } from "components/common/Body/Container.tsx";
import { Title } from "components/common/Body/Title.tsx";

/**
 * The Body of the app where art and interactables are usually located
 */
export const Body = Object.assign(
  function (props: JSX.HTMLAttributes<HTMLDivElement>) {
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
  },
  { Container, Title },
);
