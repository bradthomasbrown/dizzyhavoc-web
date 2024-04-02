import { Web3Input } from "../../islands/common/Web3Input.tsx";
import { amounts } from "../../lib/bridge/amounts.ts";
import { evmVortex } from '../../lib/faucet/evmVortex/evmVortex.ts'

export function CurrencyAmountInput(
  { id, disabled }: { id: string; disabled?: boolean },
) {
  return (
    <Web3Input
      maxVal={evmVortex.uState.dzhvBalance.value as undefined|Error|bigint}
      decimals={18n}
      {...{ amounts, id, disabled }}
    />
  );
}
