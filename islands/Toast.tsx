import { Signal } from "@preact/signals";
import { JSX } from 'preact'

export default function Toast(props: { hash:string, onClose:()=>void }&JSX.HTMLAttributes<HTMLButtonElement>) {
    return (
        <div class="flex items-center shadow-lg justify-between w-full max-w-sm min-w-96 p-4 text-[#212121] bg-white rounded-lg dark:text-white dark:bg-[#212121]" role="alert">
            <div class="inline-flex items-center flex-shrink-0 w-8 h-8 text-[#212121] bg-white rounded-lg dark:bg-[#212121] dark:text-white">
                {/* from https://github.com/SamHerbert/SVG-Loaders */}
                <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" class="dark:stroke-white stroke-[#212121]">
                    <g fill="none" fill-rule="evenodd" stroke-width="2">
                        <circle cx="22" cy="22" r="1">
                            <animate attributeName="r"
                                begin="0s" dur="1.8s"
                                values="1; 20"
                                calcMode="spline"
                                keyTimes="0; 1"
                                keySplines="0.165, 0.84, 0.44, 1"
                                repeatCount="indefinite" />
                            <animate attributeName="stroke-opacity"
                                begin="0s" dur="1.8s"
                                values="1; 0"
                                calcMode="spline"
                                keyTimes="0; 1"
                                keySplines="0.3, 0.61, 0.355, 1"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="22" cy="22" r="1">
                            <animate attributeName="r"
                                begin="-0.9s" dur="1.8s"
                                values="1; 20"
                                calcMode="spline"
                                keyTimes="0; 1"
                                keySplines="0.165, 0.84, 0.44, 1"
                                repeatCount="indefinite" />
                            <animate attributeName="stroke-opacity"
                                begin="-0.9s" dur="1.8s"
                                values="1; 0"
                                calcMode="spline"
                                keyTimes="0; 1"
                                keySplines="0.3, 0.61, 0.355, 1"
                                repeatCount="indefinite" />
                        </circle>
                    </g>
                </svg>
                <span class="sr-only">Fire icon</span>
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

