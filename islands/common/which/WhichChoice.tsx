import { Blockie } from "lib";

export function WhichChoice(
  props: { src?: string; id: string; onPick: () => void; dsrc?: string },
) {
  const dsrc = props.dsrc ?? props.src;
  return (
    <div class="min-w-24 min-h-24 max-w-24 max-h-24">
      <div
        class={`
          hover:scale-[102%]
          active:scale-[98%]
          cursor-pointer
          flex
          flex-col
          items-center
          gap-1`}
        onClick={() => props.onPick()}
      >
        <picture>
          <source srcset={dsrc} media="(prefers-color-scheme: dark)" />
          <img
            draggable={false}
            class="w-12 h-12 select-none"
            src={props.src ?? Blockie.randB64()}
          />
        </picture>
        <div
          class={`
          select-none
          text-center
          lg:text-sm
          text-xs
        `}
        >
          {props.id}
        </div>
      </div>
    </div>
  );
}