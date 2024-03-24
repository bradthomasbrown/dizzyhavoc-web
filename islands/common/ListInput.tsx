import { JSX } from "preact/jsx-runtime";

export function ListInput(props:{ addClass?:string }&JSX.HTMLAttributes<HTMLInputElement>) {
    return (
        <input
            class={`py-2 text-center text-[#2c2c2c] border dark:border-1 border-1 border-[#2c2c2c2a] dark:border-[#eaeaea2a] dark:text-[#EAEAEA] dark:placeholder:text-[#EAEAEA] placeholder:text-[#2c2c2c] placeholder:text-sm bg-[#f2f2f2] dark:bg-[#1e1e1e] rounded-lg ${props.addClass ?? ''}`}
            onInput={props.onInput}
            list={props.list}
            placeholder={props.placeholder}
        />
    )
}