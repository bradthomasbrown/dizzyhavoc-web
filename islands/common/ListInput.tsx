import { JSX } from "preact/jsx-runtime";

export function ListInput(props:{ addClass?:string }&JSX.HTMLAttributes<HTMLInputElement>) {
    return (
        <input
            class={`py-2 text-center rounded-lg ${props.addClass ?? ''}`}
            onInput={props.onInput}
            list={props.list}
            placeholder={props.placeholder}
        />
    )
}