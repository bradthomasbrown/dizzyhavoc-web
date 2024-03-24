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

        <div class="flex w-full h-screen flex-col items-center mb-[5rem]">
          <div className="min-w-full xl:min-w-[30rem] bg-blur2 shadow-xl rounded-xl flex min-h-[25rem] my-auto">
              <UI/>
          </div>
      </div>
    </>
  );
}