import { computed, Signal } from "@preact/signals";
import { WhichTitle } from "./WhichTitle.tsx";
import { WhichSearch } from "./WhichSearch.tsx";
import { WhichChoices } from "./WhichChoices.tsx";
const filter = new Signal<string>("");
/**
 * <Which/> is an island representing a "pick one from many" screen\
 * @param props.title the title of <Which/>
 * @param props.choices a {@link Choice}[] that populates <Which/>
 * @param props.onPick a function to be executed with the Choice, once chosen
 * @param props.compareFn an optional function to sort the choices by something
 * other than their name
 */
export function Which(
  props: {
    title: string;
    choices: Choice[];
    onPick: (choice: Choice) => unknown;
    compareFn?: Parameters<Choice[]["sort"]>[0];
  },
) {
  const fsChoices = computed(() => {
    return [...props.choices].filter((choice) =>
      JSON.stringify(choice.space ?? choice.value).toLowerCase().match(
        filter.value.toLowerCase(),
      )
    ).sort(props.compareFn);
  });
  return (
    <div class="w-full h-full max-h-full flex flex-col grow">
      <WhichTitle {...props} /> <WhichSearch {...{ filter }} />{" "}
      <WhichChoices choices={fsChoices.value} onPick={props.onPick} />
    </div>
  );
}
