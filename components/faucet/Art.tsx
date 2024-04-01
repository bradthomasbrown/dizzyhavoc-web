export function Art() {
  return (
    <image
      draggable={false}
      class={`
          static
          unselectable
          w-96 h-96
          select-none
          pointer-events-none
          scale-[1.50]
          blur-sm
          opacity-10
          dark:brightness-50
          brightness-150
          rotate-[-12deg]`}
      src="/misc/dzhv-art-blue-yellow-busy.jpg"
    />
  );
}

// static w-96 h-96 select-none pointer-events-none scale-150 blur-sm opacity-10 dark:brightness-50 brightness-150 rotate-[-12deg]
