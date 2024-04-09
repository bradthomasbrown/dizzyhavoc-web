import { Container } from "components/common/Art/Container.tsx";

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

export const Art = Object.assign(
  function (props: ArtProps) {
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
  },
  { Container },
);
