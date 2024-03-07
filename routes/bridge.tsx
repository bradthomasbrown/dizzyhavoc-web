import { Partial } from '$fresh/runtime.ts' // https://fresh.deno.dev/docs/concepts/partials - Partials allow areas of the page to be updated with new content by the server without causing the browser to reload the page
import Connector from '../islands/Connector.tsx'
import BridgeUI from '../islands/BridgeUI.tsx'
import Footer from '../components/Footer.tsx'

export default function Home() {
  return (
    <>
      <div class="h-[80px] items-center px-4 shadow-xl  flex bg-gradient-to-b from-[#dddddd] bg-[#cccccc]">
        <div class="justify-start w-full flex">
          <img class="h-[80px] saturate-0" src="/dzhv.png "></img>
        </div>
        <div class="justify-end w-full flex">
          <Connector />
        </div>
      </div>
      <div class="w-full h-screen flex justify-center">
        <div class="flex w-full flex-col items-center mb-[5rem]">
          <h1 class="lg:text-[5rem] text-[2.5rem] mt-[3rem] underline font-Poppins text-[#3d3d3d]">
            DizzyHavoc - Bridge
          </h1>
          <p class="font-medium italic text-[1.8rem] text-center w-full text-[#545454] sm:w-[50%] mt-[0.5rem] rounded-xl px-2 mb-[1rem]">
            Faster, smarter, more robust & secure.
          </p>
          <div className="min-w-[300px] sm:min-w-[500px] bg-[#d1d1d1]  shadow-xl rounded-xl flex h-[45%] mt-[5rem] items-center justify-center">
            <div class="flex flex-col gap-3 px-3 lg:flex-row">
              <BridgeUI />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

