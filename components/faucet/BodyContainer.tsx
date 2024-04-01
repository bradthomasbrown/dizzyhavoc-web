import { Body } from "./Body.tsx";
import { BodyTitle } from "./BodyTitle.tsx";

/**
 * The container for the body and its title
 */
export function BodyContainer() {
  return (
    <div
      className={`
      min-w-[360px]
      flex-col
      sm:min-w-[500px]
      bg-blur2
      shadow-xl
      rounded-xl
      flex
      min-h-[25rem]
      my-auto`}
    >
      <BodyTitle />
      <Body />
    </div>
  );
}
