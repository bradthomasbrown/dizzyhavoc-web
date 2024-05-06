import { useState } from "preact/hooks";
import { Noise } from "../../components/common/backgrounds/Noise.tsx";
import { Tagline } from "../../components/index/Landing/Tagline.tsx";
import { Explore } from "./Explore.tsx";
import { Carousel } from "./Carousel.tsx";
import { Screen } from "./Screen.tsx";
import { FAQ } from "./FAQ.tsx";

export function Landing() {
  const [toggle, setToggle] = useState(false);

  return (
    <div>
      <div
        className={`flex flex-row sm:h-screen h-[calc(100vh-4.5rem)] w-full justify-center ${
          toggle ? "items-start sm:items-center" : "items-center"
        }`}
      >
        <Noise />
        {!toggle ? (
          <div class="flex flex-col">
            <div className="flex flex-row gap-x-[0rem] sm:gap-x-[4rem] -translate-y-1/3">
              <div className="ml-3 sm:ml-0 sm:w-[80%] w-[65%] text-clip sm:text-nowrap text-start">
                <Tagline />
                <div
                  className="mt-[1rem] w-[150px] h-[30px] rounded-lg"
                  onClick={() => setToggle(!toggle)}
                >
                  <Explore text="Explore" />
                </div>
              </div>
              <div className="sm:size-[130px] size-[100px]">
                <Carousel />
              </div>
            </div>
            <div class="absolute sm:bottom-6 -bottom-6 sm:pb-0 pb-6">
              <FAQ />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-3 relative">
            <div class="sm:w-[calc(100vw-150px)] sm:h-[30vw] w-screen h-full">
              <Screen /> 
            </div>
            <div
              className="w-[110px] sm:w-[160px] h-[35px] sm:h-[40px] rounded-lg absolute sm:bottom-0 bottom-[11%] left-[50%] translate-x-[-50%]"
              onClick={() => setToggle(!toggle)}
            >
              <div class="sm:mt-0 mt-[18svh]">
                <Explore text="Close" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}