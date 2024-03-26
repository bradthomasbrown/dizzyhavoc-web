import { UI } from '../../islands/faucet/UI.tsx'

export function Form() {

    return (
        <>
            {/* app form */}
            <div className="min-w-[320px] sm:min-w-[500px] bg-blur2 shadow-xl rounded-xl flex flex-col justify-center items-center min-h-[25rem] overflow-hidden">

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
    )

}