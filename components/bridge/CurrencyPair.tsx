import { CurrencyAmount } from "../../islands/bridge/CurrencyAmount.tsx";

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
