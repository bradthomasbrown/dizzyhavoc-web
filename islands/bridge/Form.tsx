import { FaucetLink } from "components/bridge/mod.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { ActionButton, Control, Height } from "islands/bridge/mod.ts";
import { btos, data } from "lib/bridge/mod.ts";
import { batch } from "@preact/signals";

const elements = {
  fromControl: Control.From(),
  height: Height(),
};

function onBalanceChange(state: data.balance.MaybeState) {

  // if no state, exit, otherwise get value from state
  if (!state) return;
  
  if (state.subState.height > (potentialHeight ?? -Infinity)) {
    potentialHeight = state.subState.height
  }
  
  if ((knownHeight ?? -Infinity) > state.subState.height) {
    puzzles.delete(state.subState.height)
    return
  }

  if (!puzzles.has(state.subState.height)) {
    const chainId = state.subState.chainId
    const height = state.subState.height
    const balance = state.value
    const address = state.subState.address
    const puzzle:Puzzle = { chainId, height, balance, address }
    puzzles.set(state.subState.height, puzzle)
  } else {
    puzzles.get(state.subState.height)!.balance = state.value
    puzzles.get(state.subState.height)!.address = state.subState.address
  }

  const puzzle = puzzles.get(state.subState.height)!
  if (Object.values(puzzle).includes(null)) return

  for (const height of puzzles.keys())
    if (height <= state.subState.height) puzzles.delete(height)

  // update elements
  batch(() => {
    elements.height.display.value = String(puzzle.height!)
    elements.fromControl.balance.display.value = btos(puzzle.balance!, 18)
    if ((potentialHeight ?? -Infinity) > state.subState.height) return
    elements.height.loading.value = ''
    elements.fromControl.balance.loading.value = ''
  })

  // update known height
  knownHeight = puzzle.height!

}

function onHeightChange(state: data.height.MaybeState) {

  // if no state, exit
  if (!state) return;

  if (state.value > (potentialHeight ?? -Infinity)) {
    potentialHeight = state.value
  }

  // if known height is greater than or equal to this
  // destroy puzzle if exists then exist
  if ((knownHeight ?? -Infinity) > state.value) {
    puzzles.delete(state.value)
    return
  }

  // trigger loading on affected elements
  elements.fromControl.balance.loading.value = "loading";
  elements.height.loading.value = "loading";

  // create puzzle if we didn't have one
  if (!puzzles.has(state.value)) {
    const chainId = state.subState.chainId
    const height = state.value
    const balance = null
    const address = null
    const puzzle:Puzzle = { chainId, height, balance, address }
    puzzles.set(state.value, puzzle)
  // or update puzzle if we did
  } else {
    puzzles.get(state.value)!.height = state.value
  }

  // get puzzle. if puzzle is incomplete, return
  const puzzle = puzzles.get(state.value)!
  if (Object.values(puzzle).includes(null)) return

  for (const height of puzzles.keys())
    if (height <= state.value) puzzles.delete(height)
    
  // update elements
  batch(() => {
    elements.height.display.value = String(puzzle.height!)
    elements.fromControl.balance.display.value = btos(puzzle.balance!, 18)
    if ((potentialHeight ?? -Infinity) > state.value) return
    elements.height.loading.value = ''
    elements.fromControl.balance.loading.value = ''
  })

  // update known height
  knownHeight = puzzle.height!

}

const heightWatchDisposer: { value: null | (() => void) } = { value: null };
const balanceWatchDisposer: { value: null | (() => void) } = { value: null };

function onAddressesChange(state: data.addresses.MaybeState) {
  
  // stop watching the balance if we are doings so
  balanceWatchDisposer.value?.();

  // if no state, exit, otherwise try to get the value from the state
  if (!state) return;
  const addresses = state.value
  const address = addresses.at(0)
  if (!address) return

  tracking.address = address

  // trigger loading on affected elements
  elements.fromControl.balance.loading.value = "loading";

  // if we're tracking a chainId, start watching the balance
  if (tracking.chainId) {
    const subKey:data.balance.SubKey = [tracking.chainId, address, 'dzhv']
    balanceWatchDisposer.value = data.balance.get(subKey).subscribe(
      onBalanceChange
    )
  }

}

function onChainIdChange(state: data.chainId.MaybeState) {

  // stop watching the height and balance if we are doing so
  heightWatchDisposer.value?.();
  balanceWatchDisposer.value?.();

  knownHeight = null
  potentialHeight = null
  puzzles.clear()

  // if no state, exit, otherwise get the value from the state
  if (!state) return;
  const chainId = state.value;

  tracking.chainId = chainId

  // trigger loading on affected elements
  batch(() => {
    elements.height.loading.value = "loading";
    elements.fromControl.balance.loading.value = "loading";
  });

  // start watching the height of this chain
  heightWatchDisposer.value = data.height.get([chainId]).subscribe(
    onHeightChange,
  );

  // if we're tracking an address, watch the balance for that address
  if (tracking.address) {
    const subKey:data.balance.SubKey = [chainId, tracking.address, 'dzhv']
    balanceWatchDisposer.value = data.balance.get(subKey).subscribe(
      onBalanceChange
    )
  }

}

const tracking:{
  address:null|string
  chainId:null|number
} = { address:null, chainId:null }

let knownHeight:null|bigint = null
let potentialHeight:null|bigint = null

type Puzzle = {
  balance:null|bigint
  height:null|bigint
  address:null|string
  chainId:null|number
}

const puzzles = new Map<bigint,Puzzle>

if (IS_BROWSER) {
  data.addresses.get().subscribe(onAddressesChange);
  data.chainId.get(["from"]).subscribe(onChainIdChange);
}

export function Form() {
  return (
    <div class="select-none flex flex-col items-center gap-2">
      {elements.fromControl}
      <ActionButton />
      {elements.height}
      <FaucetLink />
    </div>
  );
}
