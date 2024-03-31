import { LegalsPopup } from "../lib/internal.ts";
import { AppContainer } from "../components/bridge/AppContainer.tsx";

export default function Home() {
  return (
    <>
      <LegalsPopup />
      <AppContainer/>
    </>
  );
}
