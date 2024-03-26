import { UI } from '../../islands/faucet/UI.tsx'

export function Form() {

    return (
        // <div class="mx-auto flex flex-col">
        <>
        
            {/* app form */}
            <div className="relative sm:w-[500px] w-[360px] bg-blur2 shadow-xl rounded-xl flex flex-col justify-center items-center min-h-[25rem] overflow-hidden">
            <div class="lg:text-[1.8rem] absolute top-2 left-2 bg-blur2 unselectable text-[1.5rem] font-[Poppins] font-medium dark:text-[#d2d2d2] text-[#282828]">
                    testnet faucet
                </div>
                {/* absolute container for background image */}
                <div class="z-[-1] w-full h-full absolute flex justify-center items-center">
                    <image
                        class="static w-96 h-96 select-none pointer-events-none scale-150 blur-sm opacity-10 dark:brightness-50 brightness-150 rotate-[-12deg]"
                        src="/misc/dzhv-art-blue-yellow-busy.jpg"
                    />
                </div>

                {/* faucet UI */}
                <UI/>

            </div>
            </>
        // </div>
    )

}