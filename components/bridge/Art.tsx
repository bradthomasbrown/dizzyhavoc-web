export function Art() {
  return (
      <image
        class={`
          static
          unselectable
          w-96 h-96
          select-none
          pointer-events-none
          scale-[1.50]
          blur-[4px]
          opacity-10
          dark:brightness-50
          contrast-150
          brightness-150
          rotate-[45deg]
          translate-x-8 
          translate-y-[-24px]`
        }
        src="/misc/dzhv-art-chevron.jpg"
      />
  );
}
