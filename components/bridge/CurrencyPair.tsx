import { CurrencyAmount } from './CurrencyAmount.tsx'

export function CurrencyPair() {
  return <>
    {['from', 'to'].map(type => <CurrencyAmount label={type == 'to' ? 'mint' : 'burn'} {...{type}}/>)}
  </>
}