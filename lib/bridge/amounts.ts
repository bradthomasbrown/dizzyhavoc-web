import { Signal, effect } from "@preact/signals";

export const amounts = new Map<string,Signal<undefined|bigint>>([
  ['from', new Signal(undefined)],
  ['to', new Signal(undefined)]
]);

effect(() => {
  const fromAmount = amounts.get('from')!.value
  if (fromAmount === undefined) return
  let toAmount = fromAmount - 10n * 10n ** 18n
  if (toAmount < 0n) toAmount = 0n
  amounts.get('to')!.value = toAmount
})