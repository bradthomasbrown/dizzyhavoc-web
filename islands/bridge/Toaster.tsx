import { JSX } from "preact/jsx-runtime";
import { toasts } from "../../lib/toasts.ts";

export function Toaster(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <div class="fixed flex flex-col gap-2 sm:bottom-5 bottom-2 right-0 sm:right-5">
      {toasts.value.map(({ component }) => component)}
    </div>
  );
}
