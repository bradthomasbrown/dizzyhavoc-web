import { JSX } from "preact/jsx-runtime";
import { dzkv } from "lib/mod.ts";
import { createRef } from "preact";
import { Signal } from "@preact/signals";
import { Connector, ConnectorState } from "islands/common/mod.ts";

/**
 * The container for everything between the navbar and the footer
 */
export function AppContainer(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const ref = createRef();

  function onClick(e: JSX.TargetedEvent<HTMLDivElement>) {
    // if (e.target !== ref.current) return;
    // dzkv.get<Signal<null | JSX.Element>>(["which"])!.value = null;
    // Connector.set(ConnectorState.READY);
  }

  return (
    <div class="flex w-full grow flex-col items-center" {...{ ref, onClick }}>
      {props.children}
    </div>
  );
}
