export function FaucetLink() {
  return (
    <a
      class={`
        select-none
        absolute bottom-1 left-1
        pr-1
        bg-blur4 rounded-xl
        text-md
        hover:scale-[102%]
      `}
      target="_blank"
      href="/faucet"
    >
      💧faucet
    </a>
  );
}
