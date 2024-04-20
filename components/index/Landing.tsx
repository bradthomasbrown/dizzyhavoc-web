import Screen from "../../islands/index/Screen.tsx";
import Tagline from "./Landing/Tagline.tsx";
import LandingBG from "../common/backgrounds/Landing.tsx";
export function Landing() {
  return (
    <div>
      <div class="flex relative flex-col h-screen justify-center items-center">
        <LandingBG />
        <Tagline />
        <Screen />
      </div>
    </div>
  );
}