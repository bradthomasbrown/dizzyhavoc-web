import { Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { statuses } from "../lib/utils/state.ts";

export default function Toast(props: { hash:string, explorer:{ name:string, url:string }, onClose:()=>void }&JSX.HTMLAttributes<HTMLButtonElement>) {
    const abbrev = `${props.hash.slice(0, 5)}...${props.hash.slice(-3)}`
    const status = statuses.get(props.hash)
    if (!status) return <></>
    const foo = new Signal()
    status.subscribe(value => {
        switch (value) {
            case '0x1': foo.value = 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-8 h-8 fill-[#92e096]">
                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z" clip-rule="evenodd" />
                </svg>; break
            case '0x0': foo.value = 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-8 h-8 fill-[#e09292]">
                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
                </svg>; break
            default: foo.value = 
                <svg aria-hidden="true" class="w-8 h-8 me-2 text-gray-300 animate-spin dark:text-gray-600 fill-gray-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>; break
        }
    })
    return (
        <div class="flex items-center shadow-lg sm:mx-auto mx-0 justify-between w-full max-w-sm min-w-80 p-4 text-[#212121] bg-white rounded-lg dark:text-white dark:bg-[#212121]" role="alert">
            <div class="inline-flex items-center flex-shrink-0 w-8 h-8 text-[#212121] bg-white rounded-lg dark:bg-[#212121] dark:text-white">
                { foo }
            </div>
            <div class="flex flex-col mr-1">
                <div class="ms-3 text-sm font-[monospace] font-bold">Sending transaction to chain.</div>
                <div class="ms-3 text-sm font-[monospace]">Bridge - Etherscan - <a href="0x123...abc">{props.hash.slice(0, 5)}...{props.hash.slice(-3)}</a></div>
            </div>
            <button onClick={props.onClose} type="button" class=" bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-[#303030] dark:hover:bg-[#414141]" data-dismiss-target="#toast-default" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
    )
}