import { JSX } from 'preact'
import Toast from './Toast.tsx'
import { IS_BROWSER } from '$fresh/runtime.ts'
import { toasts } from '../utils/mod.ts'

if (IS_BROWSER) (async () => {
    for (let i = 0; i < 3; i++)
        await new Promise<void>(r => setTimeout(() => {
            const hash = `0x${[...crypto.getRandomValues(new Uint8Array(32))].map(x => x.toString(16).padStart(2, '0')).join('')}`
            const id = Symbol()
            const onClose = () => { toasts.value = toasts.value.filter(toast => toast.id !== id); }
            const component = Toast({ hash, onClose })
            const toast = { component, id }
            toasts.value = [toast, ...toasts.value]
            r()
        }, 1000))
})()

export default function Toaster(props: JSX.HTMLAttributes<HTMLButtonElement>) {
    return (
        <div class="fixed flex flex-col gap-2 bottom-5 right-5">
            {toasts.value.map(({ component }) => component)}
        </div>
    )
}