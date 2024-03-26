import { UI } from '../lib/internal.ts'
import { Head } from "$fresh/runtime.ts";
import { LegalsPopup } from "../islands/bridge/LegalsPopup.tsx";
export default function Home() {
  return (
    <div class="h-full w-full">
         <Head>
        <title>Vertigo</title>
      </Head>
      <LegalsPopup />

        <div class="flex w-full h-screen flex-col items-center mb-[5rem]">
          <div className="min-w-[360px] sm:min-w-[500px] bg-blur2 shadow-xl rounded-xl flex min-h-[25rem] my-auto">
              <UI/>
          </div>
      </div>
    </div>
  );
}