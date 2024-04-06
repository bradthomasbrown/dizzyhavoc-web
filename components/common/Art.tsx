type ArtProps = {
  src: string;
  scale?: string;
  blur?: string;
  opacity?: string;
  brightness?: string;
  contrast?: string;
  rotate?: string;
  translate?: string;
};

export function Art(props: ArtProps) {
  return (
    <image
      class={`
        static unselectable w-96 h-96
        select-none pointer-events-none
        ${props.scale ?? "scale-[1.50]"}
        ${props.blur ?? "blur-[4px]"}
        ${props.opacity ?? "opacity-10"}
        ${props.brightness ?? "brightness-150 dark:brightness-50"}
        ${props.contrast ?? "contrast-150"}
        ${props.rotate ?? ""}
        ${props.translate ?? ""}
      `}
      src={props.src}
    />
  );
}

// export function Art({ src }:{ src:string }) {
//   return (
//     <image
//       draggable={false}
//       class={`
//           static
//           unselectable
//           w-96 h-96
//           select-none
//           pointer-events-none
//           scale-[1.50]
//           blur-[4px]
//           opacity-10
//           dark:brightness-50
//           contrast-150
//           brightness-150
//           rotate-[45deg]
//           translate-x-8
//           translate-y-[-24px]`}
//       src="/misc/dzhv-art-chevron.jpg"
//     />
//   );
// }
