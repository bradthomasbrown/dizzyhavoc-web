import { LegalsPopup } from "../islands/bridge/LegalsPopup.tsx";
import { AppContainer } from "../components/bridge/AppContainer.tsx";

export default function Home() {
  return (
    <div class="text-[#2c2c2c] dark:text-[#EAEAEA] font-[Poppins]">
      <LegalsPopup />
      <AppContainer />
    </div>
  );
}
