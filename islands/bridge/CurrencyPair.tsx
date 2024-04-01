import { Signal } from "@preact/signals";
import { CurrencyAmount } from "./CurrencyAmount.tsx";

export const amounts = new Signal<Record<string,number>>({})

export function CurrencyPair() {
  return (
    <>
      {["from", "to"].map((type, i) => (
        <CurrencyAmount
          label={type == "to" ? "mint" : "burn"} {...{ type }}
          addClass={i ? 'order-3' : 'order-1'}
        />
      ))}
    </>
  );
}
