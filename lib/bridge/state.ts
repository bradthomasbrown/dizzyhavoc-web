import { batch, Signal } from "@preact/signals";
import { dzkv } from "lib/mod.ts";

const key = ["state"];

/**
 * The A type
 * An object with two signals, b - "back", f - "front"
 * The idea is the "back" signal is used for progating throughout preact
 * And the "front" signal is what is displayed to the user
 */
export type A<T> = { b: Signal<T>; f: Signal<T> };

/**
 * The S type
 * A set of A types. A types in this set are considered 'invalidated' and
 * need their values refreshed
 */
type S = Set<A<unknown>>;

/**
 * The M type
 * A map of the A type to some value.
 * We use this to set the suggested values of all invalidated A types
 * in a single batched updated
 */
type M = Map<A<unknown>, unknown>;

/**
 * The T type
 * Combining the S and M types gives us our desired state object.
 * This object can be used to batch update values while allowing
 * reactions to occur in real time while batches are being built
 */
type T = { m: M; s: S };

/**
 * ensure the state object is created
 */
function ensure() {
  return dzkv.ensure<T>(key, { m: new Map(), s: new Set() });
}

/**
 * ensures the state object is created, then returns it
 */
function get() {
  ensure();
  return dzkv.get<T>(key)!;
}

/**
 * invalidate an A type
 * this adds the A type to the S type set of our state
 */
export function invalidate(a: A<unknown>) {
  get().s.add(a);
  console.log({ sSize: get().s.size, action: 'invalidate' })
}

/**
 * suggest a value for an A type
 * this updates our M type map in our state by setting the map's key A to
 * a value
 * this also deletes the A type from our S type set to indicate that the
 * invalidation has been dealt with
 * when our S type set reaches size 0, we batch update all A types front
 * signals with the values mapped to those A types
 * after all A types front signals are updated, we clear the M type map
 */
export function suggest<T>(a: A<T>, value: T) {
  const { m, s } = get();
  m.set(a, value);
  s.delete(a);
  console.log({ sSize: s.size, action: 'suggest' })
  if (s.size == 0) {
    batch(() => {
      for (const [a, v] of m.entries()) a.f.value = v;
    });
    m.clear();
  }
}
