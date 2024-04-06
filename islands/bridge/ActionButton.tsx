import { Signal } from "@preact/signals";
import { Connector } from "islands.common";
import { dzkv } from 'lib'

export function ActionButton() {
  const key = ['p6963', 'addresses']
  if (!dzkv.get<Signal<string[]>>(key)?.value?.length) return <Connector/>
  else return <></>;
}
