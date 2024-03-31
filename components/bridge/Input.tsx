import { Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";

const amount = new Signal<number>(0);

function handleInput(e: JSX.TargetedEvent<HTMLInputElement>) {
  amount.value = Number(e.currentTarget.value);
}

export function Input(props:JSX.DOMAttributes<HTMLInputElement>) {
  return (
    <input
      autocomplete="off"
      id="from"
      type="text"
      class="w-0 grow flex font-mono items-center text-[32px] bg-transparent"
      placeholder="0"
      onInput={(e) => {
        const value = e.currentTarget.value;
        if (value == (".")) {
          e.currentTarget.value = value
            .replace(".", "0.");
        }
        handleInput(e);
      }}
      value={amount.value}
      onKeyPress={(e) => {
        const charCode = e.which ? e.which : e.keyCode;
        if (
          charCode > 31 && (charCode < 48 || charCode > 57) &&
          charCode !== 46
        ) e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        const text = e.dataTransfer?.getData("text/plain") ??
          "";
        if (!/^\d*\.?\d*$/.test(text)) e.preventDefault();
        else {
          e.currentTarget.value = text;
          handleInput(e);
        }
      }}
      onPaste={(e) => {
        e.preventDefault();
        const text = e.clipboardData?.getData("text/plain") ??
          "";
        if (!/^\d*\.?\d*$/.test(text)) e.preventDefault();
        else {
          e.currentTarget.value = text;
          handleInput(e);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        const text = e.dataTransfer?.getData("text/plain") ??
          "";
        if (!/^\d*\.?\d*$/.test(text)) e.preventDefault();
      }}
    />
  )
}