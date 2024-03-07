import { Signal } from '@preact/signals'
import Toast from '../../islands/Toast.tsx'
import { state } from './mod.ts'
import * as e from '../ejra/mod.ts'
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
const bar = e.receipt({ hash: '' }).ejrrq.schema

function createToast({ hash, explorer, status }:{ hash:string, explorer:{ name:string, url:string }, status:Signal<"0x1"|"0x0"|null> }) {
    const id = Symbol()
    const onClose = () => {
        toasts.value = toasts.value.filter(toast => toast.id !== id)
        // state.value.receipts = (state.value.receipts.delete(hash), state.value.receipts)
        // state.value.foos = state.value.foos.filter(({ hash:h }) => h != hash)
    }
    const component = Toast({ hash, explorer, onClose })
    const toast = { component, id }
    toasts.value = [toast, ...toasts.value]
    return toast
}

const toasts = new Signal<{ component:ReturnType<typeof Toast>, id:symbol }[]>([])

export { toasts, createToast }