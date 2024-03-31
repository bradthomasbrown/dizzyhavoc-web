import { CurrencyAmount } from "../../islands/bridge/CurrencyAmount.tsx";

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
