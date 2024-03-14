import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import { useSignal } from "@preact/signals";

export default function MarketBar() {
  if (!IS_BROWSER) return <></>;
  const initialloading = useSignal<boolean>(true);
  const isloading = useSignal<boolean>(true);
  const count = useSignal<number>(30);
  // liquidity
  const liq_eth = useSignal<number>(0);
  const liq_arb = useSignal<number>(0);
  const liq_bsc = useSignal<number>(0);
  const liq_base = useSignal<number>(0);
  const liq_avax = useSignal<number>(0);
  // daily volume
  const vol24_eth = useSignal<number>(0);
  const vol24_arb = useSignal<number>(0);
  const vol24_bsc = useSignal<number>(0);
  const vol24_base = useSignal<number>(0);
  const vol24_avax = useSignal<number>(0);
  // prices
  const token_eth = useSignal<number>(0);
  const token_arb = useSignal<number>(0);
  const token_bsc = useSignal<number>(0);
  const token_base = useSignal<number>(0);
  const token_avax = useSignal<number>(0);
  // index in MarketBar column
  const arborder = useSignal<number>(0);
  const bscorder = useSignal<number>(0);
  const baseorder = useSignal<number>(0);
  const avaxorder = useSignal<number>(0);
  const ethorder = useSignal<number>(0);
  const poloorder = useSignal<number>(0);
  const a = async () => { 
    isloading.value = true;
    let arbprice = 0,
    ethprice = 0,
    bscprice = 0,
    baseprice = 0,
    avaxprice = 0
    try {
      const response = await fetch(
      "https://api.dexscreener.com/latest/dex/tokens/0x3419875B4D3Bca7F3FddA2dB7a476A79fD31B4fE"
      );
      const data = await response.json();
      console.log(data)
      for (let i = 0; i < data.pairs.length; i++) {
        const fixedvalue = Number(data.pairs[i].priceUsd).toFixed(5);
        const fixedliq = Number(data.pairs[i].liquidity.usd).toFixed(2);
        switch (data.pairs[i].url) {
          case "https://dexscreener.com/ethereum/0xb7a71c2e31920019962cb62aeea1dbf502905b81":
            token_eth.value = ethprice = Number(fixedvalue);
            liq_eth.value = fixedliq;
            vol24_eth.value = data.pairs[i].volume.h24; 
            break;
          case "https://dexscreener.com/arbitrum/0x05c5bdbc7b3c64109ddcce058ce99f4515fe1c83":
            token_arb.value = arbprice = Number(fixedvalue);
            liq_arb.value = fixedliq;
            vol24_arb.value = data.pairs[i].volume.h24;
            break;
          case "https://dexscreener.com/bsc/0x642089a5da2512db761d325a868882ece6e387f5":
            token_bsc.value = bscprice = Number(fixedvalue);
            liq_bsc.value = fixedliq;
            vol24_bsc.value = data.pairs[i].volume.h24;
            break;
          case "https://dexscreener.com/base/0xb64dff20dd5c47e6dbb56ead80d23568006dec1e":
            token_base.value = baseprice = Number(fixedvalue);
            liq_base.value = fixedliq;
            vol24_base.value = data.pairs[i].volume.h24;
            break;
          case "https://dexscreener.com/avalanche/0x523a04633b6c0c4967824471dda0abbce7c5e643":
            token_avax.value = avaxprice = Number(fixedvalue);
            liq_avax.value = fixedliq;
            vol24_avax.value = data.pairs[i].volume.h24;
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        a();
      }, 500);
    }
    largestPriceDelta(
      ethprice,
      arbprice,
      bscprice,
      baseprice,
      avaxprice, )
    isloading.value = false;
    initialloading.value = false;
  };
  function largestPriceDelta(
    token_eth: number,
    token_arb: number,
    token_bsc: number,
    token_base: number,
    token_avax: number
  ) {
    const tokens = {
      Eth: token_eth,
      Arb: token_arb,
      Bsc: token_bsc,
      Base: token_base,
      Avax: token_avax,
    };
    const sortedTokens = Object.entries(tokens).sort((a, b) => a[1] - b[1]); // Sort the tokens by price
    sortedTokens.forEach(([token], index) => {
      switch (token) {
        case "Eth":
          ethorder.value = index;
          break;
        case "Arb":
          arborder.value = index;
          break;
        case "Bsc":
          bscorder.value = index;
          break;
        case "Base":
          baseorder.value = index;
          break;
        case "Avax":
          avaxorder.value = index;
          break;
        default:
          break;
      }
    });
  }

  function formatNumber(num: number, precision = 2) { // format num in K, M, B
    const map = [
      { suffix: "T", threshold: 1e12 },
      { suffix: "B", threshold: 1e9 },
      { suffix: "M", threshold: 1e6 },
      { suffix: "K", threshold: 1e3 },
      { suffix: "", threshold: 1 },
    ];
    const found = map.find((x) => Math.abs(num) >= x.threshold);
    if (found) {
      const formatted =
        (num / found.threshold).toFixed(precision) + found.suffix;
      return formatted;
    }
    return num;
  }

  const starttimer = () => { // auto refresh logic
    let x = 30;
    const intervalId = setInterval(() => {
      if (x > 0) {
        x -= 1;
        count.value = x; // Update the progress value
      } else {
        a();
        clearInterval(intervalId); // Stop the interval when x reaches 100
        starttimer();
      }
    }, 1000);
  };

  useState(() => {
    // on load fetch data and start timer
    a();
    starttimer();
  });

  return (
    <>
      {initialloading.value ? ( // display loader
        <div class="w-full h-full flex justify-center items-center">
          <img src="./misc/loader.svg"></img>
        </div>
      ) : ( // loaded bar
        <div class="w-full flex flex-col gap-2">
          <div style={{ order: ethorder != null ? -ethorder : 0 }} class="w-full shadow-lg flex h-[7rem] sm:h-[9rem] rounded-lg xl:gap-3 gap-0 bg-blur3 flex">
          <img
              src="/chains/eth.svg"
              class="sm:size-9 ml-6 mt-6 justify-start size-7"
              title="eth"
              alt="eth"
            />
            <div class="flex items-start sm:items-center flex-row">
              <div class="flex gap-3 sm:gap-0  mx-7 sm:flex-col flex-row">
              <div class="flex-col flex sm:flex-row flex-col">
                <section class="rounded flex flex-col w-full py-1 ml-0">
                  <h1 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  Price: <h1 class="font-[Poppins] text-[#000000] font-medium dark:text-[#ccb286] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(token_eth.value)}</h1>
                  </h1>
                </section>
              </div>
              <div class="flex-col flex sm:flex-row flex-col">
                <section class="rounded flex flex-col w-full py-1 ml-0">
                  <h1 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  Liquidity: <h1 class="font-[Poppins] text-[#000000] dark:text-[#ffffff] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(liq_eth.value)}</h1>
                  </h1>
                </section>
              </div>
              <div class="flex flex-row sm:flex-col">
                <section class="rounded flex flex-col mx-auto w-full py-1 ml-0">
                  <h2 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  24h Vol: <h1 class="font-[Poppins] text-[#000000] dark:text-[#ffffff] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(vol24_eth.value)}</h1>
                  </h2>
                </section>
              </div>
              </div>
            </div>
          </div>
          <div style={{ order: arborder != null ? -arborder : 0 }} class="w-full shadow-lg flex h-[7rem] sm:h-[9rem] rounded-lg xl:gap-3 gap-0 bg-blur3 flex">
          <img
              src="/chains/arb.svg"
              class="sm:size-9 ml-6 mt-6 justify-start size-7"
              title="arb"
              alt="arb"
            />
            <div class="flex items-start sm:items-center flex-row">
              <div class="flex gap-3 sm:gap-0  mx-7 sm:flex-col flex-row">
              <div class="flex-col flex sm:flex-row flex-col">
                <section class="rounded flex flex-col w-full py-1 ml-0">
                  <h1 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  Price: <h1 class="font-[Poppins] text-[#000000] font-medium dark:text-[#ccb286] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(token_arb.value)}</h1>
                  </h1>
                </section>
              </div>
              <div class="flex-col flex sm:flex-row flex-col">
                <section class="rounded flex flex-col w-full py-1 ml-0">
                  <h1 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  Liquidity: <h1 class="font-[Poppins] text-[#000000] dark:text-[#ffffff] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(liq_arb.value)}</h1>
                  </h1>
                </section>
              </div>
              <div class="flex flex-row sm:flex-col">
                <section class="rounded flex flex-col mx-auto w-full py-1 ml-0">
                  <h2 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  24h Vol: <h1 class="font-[Poppins] text-[#000000] dark:text-[#ffffff] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(vol24_arb.value)}</h1>
                  </h2>
                </section>
              </div>
              </div>
            </div>
          </div>
          <div style={{ order: avaxorder != null ? -avaxorder : 0 }} class="w-full shadow-lg flex h-[7rem] sm:h-[9rem] rounded-lg xl:gap-3 gap-0 bg-blur3 flex">
          <img
              src="/chains/avax.svg"
              class="sm:size-9 ml-6 mt-6 justify-start size-7"
              title="avax"
              alt="avax"
            />
           <div class="flex items-start sm:items-center flex-row">
              <div class="flex gap-3 sm:gap-0  mx-7 sm:flex-col flex-row">
              <div class="flex-col flex sm:flex-row flex-col">
                <section class="rounded flex flex-col w-full py-1 ml-0">
                  <h1 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  Price: <h1 class="font-[Poppins] text-[#000000] font-medium dark:text-[#ccb286] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(token_avax.value)}</h1>
                  </h1>
                </section>
              </div>
              <div class="flex-col flex sm:flex-row flex-col">
                <section class="rounded flex flex-col w-full py-1 ml-0">
                  <h1 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  Liquidity: <h1 class="font-[Poppins] text-[#000000] dark:text-[#ffffff] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(liq_avax.value)}</h1>
                  </h1>
                </section>
              </div>
              <div class="flex flex-row sm:flex-col">
                <section class="rounded flex flex-col mx-auto w-full py-1 ml-0">
                  <h2 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  24h Vol: <h1 class="font-[Poppins] text-[#000000] dark:text-[#ffffff] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(vol24_avax.value)}</h1>
                  </h2>
                </section>
              </div>
              </div>
            </div>
          </div>
          <div style={{ order: baseorder != null ? -baseorder : 0 }} class="w-full shadow-lg flex h-[7rem] sm:h-[9rem] rounded-lg xl:gap-3 gap-0 bg-blur3 flex">
          <img
              src="/chains/base.svg"
              class="sm:size-9 ml-6 mt-6 justify-start size-7"
              title="base"
              alt="base"
            />
            <div class="flex items-start sm:items-center flex-row">
              <div class="flex gap-3 sm:gap-0  mx-7 sm:flex-col flex-row">
              <div class="flex-col flex sm:flex-row flex-col">
                <section class="rounded flex flex-col w-full py-1 ml-0">
                  <h1 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  Price: <h1 class="font-[Poppins] text-[#000000] font-medium dark:text-[#ccb286] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(token_base.value)}</h1>
                  </h1>
                </section>
              </div>
              <div class="flex-col flex sm:flex-row flex-col">
                <section class="rounded flex flex-col w-full py-1 ml-0">
                  <h1 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  Liquidity: <h1 class="font-[Poppins] text-[#000000] dark:text-[#ffffff] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(liq_base.value)}</h1>
                  </h1>
                </section>
              </div>
              <div class="flex flex-row sm:flex-col">
                <section class="rounded flex flex-col mx-auto w-full py-1 ml-0">
                  <h2 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  24h Vol: <h1 class="font-[Poppins] text-[#000000] dark:text-[#ffffff] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(vol24_base.value)}</h1>
                  </h2>
                </section>
              </div>
              </div>
            </div>
          </div>
          <div style={{ order: bscorder != null ? -bscorder : 0 }} class="w-full shadow-lg flex h-[7rem] sm:h-[9rem] rounded-lg xl:gap-3 gap-0 bg-blur3 flex">
          <img
              src="/chains/bsc.svg"
              class="sm:size-9 ml-6 mt-6 justify-start size-7"
              title="bsc"
              alt="bsc"
            />
            <div class="flex items-start sm:items-center flex-row">
              <div class="flex gap-3 sm:gap-0  mx-7 sm:flex-col flex-row">
              <div class="flex-col flex sm:flex-row flex-col">
                <section class="rounded flex flex-col w-full py-1 ml-0">
                  <h1 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  Price: <h1 class="font-[Poppins] text-[#000000] font-medium dark:text-[#ccb286] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(token_bsc.value)}</h1>
                  </h1>
                </section>
              </div>
              <div class="flex-col flex sm:flex-row flex-col">
                <section class="rounded flex flex-col w-full py-1 ml-0">
                  <h1 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  Liquidity: <h1 class="font-[Poppins] text-[#000000] dark:text-[#ffffff] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(liq_bsc.value)}</h1>
                  </h1>
                </section>
              </div>
              <div class="flex flex-row sm:flex-col">
                <section class="rounded flex flex-col mx-auto w-full py-1 ml-0">
                  <h2 class="font-[Poppins] dark:text-[#d2d2d2] text-[#1a1a1a] text-[0.8rem] sm:text-[1rem] inline justify-center tracking-tight items-center">
                  24h Vol: <h1 class="font-[Poppins] text-[#000000] dark:text-[#ffffff] text-[1rem] sm:text-[1.2rem] inline">${formatNumber(vol24_bsc.value)}</h1>
                  </h2>
                </section>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}