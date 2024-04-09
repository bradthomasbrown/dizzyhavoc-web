import { batch, Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { data } from "lib/bridge/mod.ts";
import { useRef } from "preact/hooks";
import * as percents from "islands/bridge/control/from/Percents.tsx";

const control = data.control.from;

/**
 * how many mousemove events to skip before updating the percent
 */
const skip = 10;
/**
 * tracker that counts down on each mousemove event
 */
let track = skip;

function updatePosition(e: MouseEvent) {
  if (!e.movementX) return;
  batch(() => {
    track--;
    if (track > 0) return;
    track = skip;
    const { get, set } = control.percent;
    const percent = Math.min(100, Math.max(0, get().value + e.movementX));
    signal.value = percent;
    set(percent);
  });
}

function onPointerDown(
  e: JSX.TargetedEvent<HTMLCanvasElement>,
  active: Signal<boolean>,
) {
  if (navigator.maxTouchPoints > 0) return;
  control.type.set("percent");
  percents.deactivate();
  if (!active.value) {
    signal.value = 0;
    control.percent.set(0);
  }
  active.value = true;
  e.currentTarget.requestPointerLock();
  document.addEventListener("mousemove", updatePosition, false);
}

function onPointerUp() {
  if (navigator.maxTouchPoints > 0) return;
  document.exitPointerLock();
  document.removeEventListener("mousemove", updatePosition, false);
}

export const signal = new Signal(0);

const trackedTouch: { value: null | Touch } = { value: null };

export function Slip({ active }: { active: Signal<boolean> }) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const div = useRef<HTMLDivElement | null>(null);
  const disp = useRef<HTMLDivElement | null>(null);

  function onTouchStart(e: TouchEvent) {
    if (
      e.target !== canvas.current &&
      e.target !== div.current &&
      e.target !== disp.current
    ) return;
    control.type.set("percent");
    percents.deactivate();
    if (!active.value) {
      signal.value = 0;
      control.percent.set(0);
    }
    active.value = true;
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
    signal.value = percent;
    control.percent.set(percent);
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
          active.value
            ? "brightness-110 dark:brightness-90 scale-[98%]"
            : `hover:brightness-95 active:brightness-110
              dark:hover:brightness-105 dark:active:brightness-90
              hover:scale-[102%] active:scale-[98%]`
        }
        `}
        onPointerDown={(e) => onPointerDown(e, active)}
        onPointerUp={onPointerUp}
      >
      </canvas>
      <div ref={disp} class="absolute pointer-events-none text-xs">
        {signal.value ? `${signal.value}%` : "🧙"}
      </div>
    </div>
  );
}
