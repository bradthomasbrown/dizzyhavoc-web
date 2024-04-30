import { batch, Signal } from "@preact/signals";
import { Button } from "components/common/Button.tsx";
import { getProviders } from "lib/faucet/getProviders.tsx";

const text = new Signal<string>("Connect");
const textSize = new Signal<undefined | string>(undefined);
const disabled = new Signal<boolean>(false);

export enum ConnectorState {
  READY,
  PICK,
  LOADING,
}

function set(state: ConnectorState) {
  batch(() => {
    switch (state) {
      case ConnectorState.READY:
        text.value = "Connect";
        textSize.value = undefined;
        disabled.value = false;
        break;
      case ConnectorState.PICK:
        text.value = "Getting Providers";
        textSize.value = "text-sm";
        disabled.value = true;
        break;
      case ConnectorState.LOADING:
        text.value = "Loading";
        textSize.value = undefined;
        disabled.value = true;
    }
  });
}

export const Connector = Object.assign(
  function () {
    function onClick() {
      set(ConnectorState.LOADING);
      getProviders();
    }
    return <Button {...{ textSize, disabled, onClick }}>{text}</Button>;
  },
  { set },
);
