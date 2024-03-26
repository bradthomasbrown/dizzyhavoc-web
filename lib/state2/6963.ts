import { P1193 } from './1193.ts'

declare global {
    interface WindowEventMap {
        'eip6963:announceProvider': EIP6963AnnounceProviderEvent;
    }
}

interface EIP6963ProviderInfo {
    uuid: string
    name: string
    icon: string
    rdns: string
}

interface EIP6963ProviderDetail {
    info:EIP6963ProviderInfo
    provider:P1193
}


export interface EIP6963AnnounceProviderEvent extends CustomEvent {
    type: "eip6963:announceProvider"
    detail: EIP6963ProviderDetail
}