import { Signal } from "@preact/signals";
import Toast from "../islands/Toast.tsx";

function createToast({ hash, explorer }:{ hash:string, explorer:string }) {
    const id = Symbol()
    const onClose = () => { toasts.value = toasts.value.filter(toast => toast.id !== id); }
    const component = Toast({ hash, onClose })
    const toast = { component, id }
    toasts.value = [toast, ...toasts.value]
}

const toasts = new Signal<{ component:ReturnType<typeof Toast>, id:symbol }[]>([])

export { toasts, createToast }