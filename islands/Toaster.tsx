import { JSX } from 'preact'
import Toast from './Toast.tsx'
import { IS_BROWSER } from '$fresh/runtime.ts'
import { toasts } from '../utils/mod.ts'
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { Signal } from "@preact/signals";
import * as e from '../ejra/mod.ts'
const bar = e.receipt({ hash: '' }).ejrrq.schema

export default function Toaster(props: JSX.HTMLAttributes<HTMLButtonElement>) {
    return (
        <div class="fixed flex flex-col gap-2 bottom-5 right-5">
            {toasts.value.map(({ component }) => component)}
        </div>
    )
}