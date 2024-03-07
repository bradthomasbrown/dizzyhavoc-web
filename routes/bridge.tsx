import { Partial } from '$fresh/runtime.ts' // https://fresh.deno.dev/docs/concepts/partials - Partials allow areas of the page to be updated with new content by the server without causing the browser to reload the page
import Connector from '../islands/Connector.tsx'
import BridgeUI from '../islands/BridgeUI.tsx'
import Footer from '../components/Footer.tsx'
import LegalsPopup from '../islands/LegalsPopup.tsx';
export default function Home() {
  return (
    <>
      <LegalsPopup />
      <div class="sm:min-h-[4rem] min-h-[6.5rem] w-full sm:w-[40rem] justify-center mx-auto items-center px-4 flex bg-gradient-to-b border-e-transparent border-s-transparent border-t-transparent border-[#dbdbdb] border border-1 bg-[#f3f3f3]">
        <div class="justify-start w-full flex">
        <div class="lg:text-[1.8rem] my-auto justify-center text-[1.5rem] font-[Poppins] font-medium font-Poppins text-[#3d3d3d]">DizzyHavoc - Bridge</div>
        </div>
        <div class="justify-end w-full flex">
        <Connector/>
        </div>
      </div>
      <div class="w-full h-screen flex justify-center">
  
        <div class="flex w-full flex-col items-center mb-[5rem]">
          <p class="italic sm:text-[1.6rem] text-[1.2rem] text-center w-full text-[#545454] sm:w-[50%] mt-[2.5rem] rounded-xl px-2 mb-[1rem]">
            Cheaper, faster, more robust & secure.
          </p>
          <div className="min-w-[390px] sm:min-w-[500px] bg-[#d1d1d1] shadow-xl rounded-xl flex min-h-[25rem] sm:mt-[10rem] mt-[1rem] items-center justify-center">
          <div class="border absolute min-w-full -z-10 sm:min-w-[70rem] border-t-transparent border-b-transparent h-full border border-[#EAEAEA] ">
          </div>
            <div class="flex flex-col gap-3 px-3 lg:flex-row  ">
              <BridgeUI />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

