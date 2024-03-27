import { UI } from '../../islands/bridge/UI.tsx'

export function Form() {
    return (
      <>
        {/* app form */}
        <div className="relative sm:w-[500px] w-[360px] bg-blur2 shadow-xl rounded-xl flex flex-col justify-center items-center min-h-[25rem] overflow-hidden">

          {/* absolute container for background image */}
          <div class="z-[-1] w-full h-full absolute flex justify-center items-center">
            <image
              class="static w-96 h-96 select-none pointer-events-none scale-[1.50] blur-[4px] opacity-10 dark:brightness-50 contrast-150 brightness-150 rotate-[45deg] translate-x-8 translate-y-[-24px]"
              src="/misc/dzhv-art-chevron.jpg"
            />
          </div>
  
          {/* bridge UI */}
          <UI />

        </div>
      </>
    );
  }
  