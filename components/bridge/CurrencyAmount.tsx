import { Input } from "../../islands/common/Input.tsx"
import { FhChainPicker } from '../../islands/common/FhChainPicker.tsx'
import { chosenChains } from '../../lib/bridge/chosenChains.ts'
import { pickChain } from '../../lib/bridge/pickChain.tsx'

export function CurrencyAmount(props:{ direction:string }) {
  return (
    <>
      <Input/>
      <FhChainPicker
        chosen={chosenChains}
        id={props.direction}
        onClick={pickChain}
        addClass="translate-x-[calc(50%+8px)]"
      />
    </>
  )
}