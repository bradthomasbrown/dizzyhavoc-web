import { UI } from '../lib/internal.ts'
import { Head } from "$fresh/runtime.ts";
export default function Home() {
  return (
    <>
         <Head>
        <title>Vertigo</title>
        <link rel="icon" href="/misc/Vertigo2.png" />
      </Head>
      {/* <LegalsPopup /> */}
      <div class="w-full h-screen flex justify-center">
        <div class="flex w-full flex-col items-center mb-[5rem]">
          <div className="min-w-[320px] sm:min-w-[500px] bg-blur2 shadow-xl rounded-xl flex min-h-[25rem] my-auto">
            <div class="flex flex-col lg:flex-row">
              <UI/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}