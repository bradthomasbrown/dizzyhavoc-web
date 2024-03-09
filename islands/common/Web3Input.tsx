import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal, useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";

export function Web3Input(
  props:{ decimals:bigint, maxVal:bigint|null|undefined, val:Signal<undefined|bigint|null> }&JSX.HTMLAttributes<HTMLInputElement>,
) {

    const decimals = 18
    const numValue = useSignal('0')
    const rangeValue = useSignal(0n)

    function onTextInput(e:JSX.TargetedEvent<HTMLInputElement>) {
        const { maxVal } = props
        if (maxVal === undefined || maxVal === null) return
        numValue.value = e.currentTarget.value
        let tmp = `${numValue}`
        if (tmp.match(/[^\d\.]|\..*\.|^\.?$/))
            return props.val.value = rangeValue.value = 0n
        const index = tmp.match(/\./)?.index ?? tmp.length - 1
        const fracs = tmp.length - 1 - index
        const zeros = Array(Math.max(decimals - fracs, 0)).fill('0').join('')
        if (fracs > decimals) tmp = tmp.slice(0, decimals - fracs)
        tmp = tmp.replace(/\./, '')
        props.val.value = BigInt(`${tmp}${zeros}`)
        rangeValue.value = props.val.value * 100n / maxVal
    }

    function onRangeInput(e:JSX.TargetedEvent<HTMLInputElement>) {
        const { maxVal } = props
        if (maxVal === undefined || maxVal === null) return
        rangeValue.value = BigInt(e.currentTarget.value)
        props.val.value = BigInt(rangeValue.value) * maxVal / 100n
        let tmp = `${props.val.value}`.padStart(decimals, '0')
        if (tmp.length == decimals) tmp = `0.${tmp}`
        else tmp = `${tmp.slice(0, tmp.length - decimals)}.${
            tmp.slice(tmp.length - decimals)}`
        tmp = tmp.replace(/\.?0*$/, '')
        numValue.value = tmp
    }

  return (
    <div class="flex flex-col">
      <input type="text"
          {...props}
          disabled={!IS_BROWSER||props.disabled}
          class="h-[9mm] py-2 px-3 text-xl bg-transparent border-solid border-b-2 border-[#8d8d8d] rounded-sm caret-[#000000] text-[#161616] font-[monospace]"
          value={numValue}
          onInput={onTextInput}
      />
      <input type="range"
          {...props}
          disabled={!IS_BROWSER||props.disabled}
          class="h-[9mm] text-xl accent-[#222222]"
          value={rangeValue.value.toString()}
          onInput={onRangeInput}
      />
    </div>
  )

}