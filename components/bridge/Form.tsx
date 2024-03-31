import { ArtContainer } from "./ArtContainer.tsx";

export function Form() {
  return (
    <div className={`
      relative
      sm:w-[500px] w-[360px]
      bg-blur2
      shadow-xl
      rounded-xl
      flex flex-col 
      justify-center
      items-center
      overflow-hidden
      min-h-[25rem] max-h-[500px] h-[500px]`
    }>
      <ArtContainer/>
      {/* <UI /> */}
    </div>
  );
}
