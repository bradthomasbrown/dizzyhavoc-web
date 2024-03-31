import { CurrencyAmount } from './CurrencyAmount.tsx'

export function CurrencyPair() {
  return <>{['from', 'to'].map(direction => <CurrencyAmount {...{direction}}/>)}</>
}