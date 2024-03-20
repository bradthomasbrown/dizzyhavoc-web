import { LegalsPopup, Connector, UI, Footer } from '../lib/internal.ts'
import { Head } from "$fresh/runtime.ts";
export default function Home() {
  return (
    <>
         <Head>
        <title>Vertigo</title>
        <link rel="icon" href="/misc/Vertigo2.png" />
      </Head>
      <LegalsPopup />
      <div class="sm:min-h-[4rem] min-h-[4.5rem] w-full sm:bg-transparent dark:sm:bg-transparent dark:bg-[#2828283f] bg-[#dbdbdb3f] sm:w-[45rem] justify-center mx-auto items-center px-4 flex  border-e-transparent border-s-transparent border-t-transparent dark:border-e-transparent dark:border-s-transparent dark:border-t-transparent dark:border-[#5e5e5e4d] border-[#dbdbdb] border">
      <div class="justify-start w-full flex">
        <div class="lg:text-[1.8rem] unselectable sm:gap-2 gap-1 items-center flex justify-center text-[1.5rem] font-[Poppins] font-medium z-10 font-Poppins dark:text-[#d2d2d2] text-[#282828]">
          <a href="/">
          <img
            src="/misc/Vertigo2.png"
            className="lg:max-w-[40px] invert dark:invert-0 max-w-[35px] flex hover:scale-[105%]"
          ></img></a>
          Vertigo
        </div>
      </div>
      <div class="justify-end w-full flex">
        <div>
          <Connector />
        </div>
      </div>
    </div>
      <div class="w-full h-screen flex justify-center">
        <div class="flex w-full flex-col items-center mb-[5rem]">
          <div className="min-w-[320px] sm:min-w-[500px] bg-blur2 shadow-xl rounded-xl flex min-h-[25rem] sm:mt-[10rem] mt-[1rem]">
            <div class="flex flex-col lg:flex-row">
              <UI/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}