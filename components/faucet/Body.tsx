import { ArtContainer } from "./ArtContainer.tsx";
// import { ActiveForm } from "../../islands/faucet/ActiveForm.tsx";

/**
 * The Body of the app where art and interactables are usually located
 */
export function Body() {
  return (
    <div
      draggable={false}
      className={`
        relative
        sm:w-[500px] w-[360px]
        bg-blur2
        shadow-xl
        rounded-xl
        flex flex-col 
        justify-center
        items-center
        overflow-hidden
        min-h-[25rem] max-h-[500px] h-[500px]`}
    >
      <ArtContainer />
      {/* <ActiveForm /> */}
    </div>
  );
}
