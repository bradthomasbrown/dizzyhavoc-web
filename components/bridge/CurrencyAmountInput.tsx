export function CurrencyAmountInput() {
  return (
    <input
      autoComplete="off"
      type="number" // this handles most validation for us
      placeholder="0"
      class={`
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
        w-100
        font-mono
        text-[32px]
        bg-transparent
        px-2
        mr-2
        max-w-[200px]
      `}
    />
  )
}