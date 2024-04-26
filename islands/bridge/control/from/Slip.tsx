import { batch, computed, Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { useRef } from "preact/hooks";
import { state } from "lib/state.ts";

let foo = 0
const scale = 30

function updatePosition(e: MouseEvent) {
  if (!e.movementX) return;
  foo = Math.min(100 * scale, Math.max(0, foo + e.movementX))
  batch(() => {
    const percent = Math.min(100, Math.max(0, Math.floor(foo / scale)));
    state.from.input.percent.value = percent
  });
}

function onPointerDown(e: JSX.TargetedEvent<HTMLCanvasElement>) {
  if (navigator.maxTouchPoints > 0) return;
  if (state.from.input.type.value != 'slip')
    state.from.input.percent.value = 0
  state.from.input.type.value = 'slip'
  e.currentTarget.requestPointerLock();
  document.addEventListener("mousemove", updatePosition, false);
}

function onPointerUp() {
  if (navigator.maxTouchPoints > 0) return;
  document.exitPointerLock();
  document.removeEventListener("mousemove", updatePosition, false);
}

const trackedTouch: { value: null | Touch } = { value: null };

export function Slip() {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const div = useRef<HTMLDivElement | null>(null);
  const disp = useRef<HTMLDivElement | null>(null);

  function onTouchStart(e: TouchEvent) {
    if (
      e.target !== canvas.current &&
      e.target !== div.current &&
      e.target !== disp.current
    ) return;
    if (state.from.input.type.value != 'slip')
      state.from.input.percent.value = 0
    state.from.input.type.value = 'slip'
    trackedTouch.value = Object.values(e.targetTouches).at(0) ?? null;
    document.addEventListener("touchcancel", onTouchCancel);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  }

  function onTouchMove(e: TouchEvent) {
    const tt = trackedTouch.value;
    if (!tt) return;
    const j = tt.identifier;
    const t = Object.values(e.touches).find(({ identifier: i }) => i === j);
    if (!t) return;
    const delta = t.screenX - tt.screenX;
    const percent = Math.floor(Math.min(100, Math.max(0, delta / 1.5)));
    state.from.input.percent.value = percent
  }

  function onTouchEnd(e: TouchEvent) {
    if (
      e.target !== canvas.current &&
      e.target !== div.current &&
      e.target !== disp.current
    ) return;
    trackedTouch.value = null;
    document.removeEventListener("touchcancel", onTouchCancel);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  }

  function onTouchCancel(e: TouchEvent) {
    if (
      e.target !== canvas.current &&
      e.target !== div.current &&
      e.target !== disp.current
    ) return;
    trackedTouch.value = null;
    document.removeEventListener("touchcancel", onTouchCancel);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  }

  const active = computed(() => state.from.input.type.value == 'slip')

  return (
    <div
      ref={div}
      class={`
        relative
        w-full h-full
        flex items-center justify-center
        font-extralight
      `}
      onTouchStart={onTouchStart}
    >
      <canvas
        ref={canvas}
        class={`
          w-full h-full
          dark:bg-[#191919] bg-[#f1f1f1]
          border border-[#e9e9e9] dark:border-[#ffffff1f]
          shadow-lg rounded-lg
          cursor-pointer
          ${
            state.from.input.type.value == 'slip'
              ? "brightness-110 dark:brightness-90 scale-[98%]"
              : `hover:brightness-95 active:brightness-110
                dark:hover:brightness-105 dark:active:brightness-90
                hover:scale-[102%] active:scale-[98%]`
          }
        `}
        onPointerDown={(e) => onPointerDown(e)}
        onPointerUp={onPointerUp}
      >
      </canvas>
      <div ref={disp} class="absolute pointer-events-none text-xs">
        {active.value ? `${state.from.input.percent.value}%` : "🧙"}
      </div>
    </div>
  );
}
