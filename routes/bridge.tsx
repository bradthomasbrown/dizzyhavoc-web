import { Partial } from '$fresh/runtime.ts' // https://fresh.deno.dev/docs/concepts/partials - Partials allow areas of the page to be updated with new content by the server without causing the browser to reload the page
import Connector from '../islands/Connector.tsx'
import BridgeUI from '../islands/BridgeUI.tsx'

export default function Home() {
  return (
    <div>
      <div class="flex flex-col items-center justify-center overflow-hidden">
        <div class="mb-5 w-[1920px] h-[400px] overflow-hidden flex justify-center items-center">
          <image class="h-[600px] lg:h-auto" src="/dzhv.png"/>
        </div>
        <h1 class="text-4xl font-bold font-mono mb-8">dizzyhavoc-bridge</h1>
        <Connector/>
        <BridgeUI/>
      </div>
    </div>
  );
}