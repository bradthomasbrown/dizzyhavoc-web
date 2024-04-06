import { Signal } from "@preact/signals";
import { WhichTitle } from "./WhichTitle.tsx";
import { WhichSearch } from "./WhichSearch.tsx";
import { WhichChoices } from "./WhichChoices.tsx";
import { WhichCancel } from "./WhichCancel.tsx";
import { Choice } from "lib/mod.ts";
import { Button } from "components/common/mod.ts";
/**
 * <Which/> is an island representing a "pick one from many" screen\
 * @param props.title the title of <Which/>
 * @param props.choices a {@link Choice}[] that populates <Which/>
 * @param props.onPick a function to be executed with the Choice, once chosen
 * @param props.compareFn an optional function to sort the choices by something
 * other than their name
 */
export function Which<T extends unknown>(
  { title, choices, onPick, compareFn }: {
    title: string;
    choices: Signal<Choice<T>[]>;
    onPick: (value: T) => unknown;
    compareFn?: Parameters<Choice<T>[]["sort"]>[0];
  },
) {
  const filter = new Signal<string>("");
  return (
    <div class="w-full h-full max-h-full flex flex-col grow">
      <WhichCancel />
      <WhichTitle {...{ title }} />
      <WhichSearch {...{ filter }} />
      <WhichChoices {...{ choices, filter, onPick, compareFn }} />
    </div>
  );
}
