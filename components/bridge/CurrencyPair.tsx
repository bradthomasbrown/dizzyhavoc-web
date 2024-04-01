import { Signal } from "@preact/signals";
import { CurrencyAmount } from "../../islands/bridge/CurrencyAmount.tsx";

export const amounts = new Signal<Map<string, bigint>>(new Map());

export function CurrencyPair() {
  return (
    <>
      {["from", "to"].map((id, i) => (
        <CurrencyAmount
          label={id == "to" ? "mint" : "burn"}
          {...{ id }}
          order={i ? "order-3" : "order-1"}
          disabled={i != 0}
        />
      ))}
    </>
  );
}
