import { Art } from "./Art.tsx";

export function ArtContainer() {
  return (
      <div class={`
          z-[-1]
          w-full
          h-full
          absolute
          flex
          justify-center
          items-center`
      }>
        <Art/>
      </div>
  );
}
