export function Dollars() {
  return (
    <div
      class={`
      row-start-3 col-start-1 col-span-1
      w-32 h-6
      px-2
      flex items-center
      font-mono
      brightness-75
      text-sm
    `}
    >
      <div
        class={`
          rounded-full border unload-[]
          ${'foo'}
        `}
      >
        {'$0.00'}
      </div>
    </div>
  );
}
