import { batch } from "@preact/signals";
import { JSX } from 'preact/jsx-runtime'
import { data } from 'lib/bridge/mod.ts'

const control = data.control.from

/**
 * how many mousemove events to skip before updating the percent
 */
const skip = 25
/**
 * tracker that counts down on each mousemove event
 */
let track = skip

function updatePosition(e:MouseEvent) {
  if (!e.movementX) return
  batch(() => {
    track--
    if (track > 0) return
    track = skip
    const { get, set } = control.percent
    set(Math.min(100, Math.max(0, get().value + e.movementX)))
  })
}

function onPointerDown(e:JSX.TargetedEvent<HTMLCanvasElement>) {
  control.type.set('percent')
  e.currentTarget.requestPointerLock()
  document.addEventListener('mousemove', updatePosition, false)
}

function onPointerUp() {
  document.exitPointerLock()
  document.removeEventListener('mousemove', updatePosition, false)
}

export function Slip() {
  return (
    <div class={`
      relative
      row-start-2 col-start-2 col-span-1
      w-16 h-12
      flex items-center justify-center
    `}>
      <canvas
        class={`
          w-3/4 h-3/4
          dark:bg-[#191919] bg-[#f1f1f1]
          border border-[#e9e9e9] dark:border-[#ffffff1f]
          shadow-lg rounded-lg
          cursor-pointer
          hover:brightness-95 active:brightness-110
          dark:hover:brightness-105 dark:active:brightness-90
          hover:scale-[102%] active:scale-[98%]
        `}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
      </canvas>
      <div class="absolute pointer-events-none text-sm">
        {control.percent.get().value}%
      </div>
    </div>
  )
}