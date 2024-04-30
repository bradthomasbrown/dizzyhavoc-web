import {
  ActionButton, Code, Balance, Height, ConnectionInfo
} from 'islands/faucet/mod.ts'

export function Form() {
  return <>
    <ConnectionInfo />
    <Height/>
    <div class="select-none flex flex-col items-center gap-2">
      <Balance/>
      <ActionButton/>
      <div class={`
        absolute
        top-3 right-3
        w-full
        flex flex-col gap-2
        text-sm font-mono
      `}>
        <Code />
      </div>
    </div>
  </>
}