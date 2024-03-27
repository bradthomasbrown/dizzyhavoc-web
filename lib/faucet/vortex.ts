import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { batch } from '@preact/signals'
import { Gate } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.0/mod.ts'
import { query } from '../chains/query.ts'
import {
    Vortex,
    VortexFlow,
    VortexFlows,
    VortexData,
    TStateOperator
} from '../state2/Vortex.ts'
import { p1193 as sp1193, P1193, P5749, P6963, getG1193, EIP6963AnnounceProviderEvent } from '../state2/providers.ts'
import { ejra } from './ejra.ts'
import { Blockie } from '../blockies/Blockie.ts'
import { choose } from '../../islands/common/Connector.tsx'

const init:VortexFlow = async function() {
    
    // trigger and refresh the abort controller
    this.controller.value.abort()
    const controller = new AbortController()
    this.controller.value = controller

    // invalidate values in tState as specified by this flow
    for (const key of this.invalidate) this.tState[key] = undefined

    // while there are updaters that need to complete, run all updaters
    while (this.updaters.value.size) {

        const { signal } = controller
        
        await Promise.all([...this.updaters.value].map(updater => {
            const { tState, updaters, flow } = this
            const key = this.dataKey.get(updater) as string
            const dependencies = this.dependencies.get(updater) as string[]
            const operator = new TStateOperator({ tState, key, signal, controller, updater, updaters })
            const datumUpdaterContext = { operator, dependencies, flow }
            return updater.bind(datumUpdaterContext)()
        }))

    }

    const gate = new Gate<void>()
    batch(() => {
        if (!controller.signal.aborted)
            for (const [key, value] of Object.entries(this.tState)) this.uState[key].value = value
        gate.resolve()
    })
    await gate.promise

    while (!controller.signal.aborted) await poll()

}

const chain:VortexFlow = async function() {
    
    // trigger and refresh the abort controller
    this.controller.value.abort()
    const controller = new AbortController()
    this.controller.value = controller

    // invalidate values in tState as specified by this flow
    for (const key of this.invalidate) this.tState[key] = undefined

    // while there are updaters that need to complete, run all updaters
    while (this.updaters.value.size) {

        const { signal } = controller
        
        await Promise.all([...this.updaters.value].map(updater => {
            const { tState, updaters, flow } = this
            const key = this.dataKey.get(updater) as string
            const dependencies = this.dependencies.get(updater) as string[]
            const operator = new TStateOperator({ tState, key, signal, controller, updater, updaters })
            const datumUpdaterContext = { operator, dependencies, flow }
            return updater.bind(datumUpdaterContext)()
        }))

    }

    const gate = new Gate<void>()
    batch(() => {
        if (!controller.signal.aborted)
            for (const [key, value] of Object.entries(this.tState)) this.uState[key].value = value
        gate.resolve()
    })
    await gate.promise

    while (!controller.signal.aborted) await poll()

}

const account:VortexFlow = async function() {
    
    // trigger and refresh the abort controller
    this.controller.value.abort()
    const controller = new AbortController()
    this.controller.value = controller

    // invalidate values in tState as specified by this flow
    for (const key of this.invalidate) this.tState[key] = undefined

    // while there are updaters that need to complete, run all updaters
    while (this.updaters.value.size) {

        const { signal } = controller
        
        await Promise.all([...this.updaters.value].map(updater => {
            const { tState, updaters, flow } = this
            const key = this.dataKey.get(updater) as string
            const dependencies = this.dependencies.get(updater) as string[]
            const operator = new TStateOperator({ tState, key, signal, controller, updater, updaters })
            const datumUpdaterContext = { operator, dependencies, flow }
            return updater.bind(datumUpdaterContext)()
        }))

    }

    const gate = new Gate<void>()
    batch(() => {
        if (!controller.signal.aborted)
            for (const [key, value] of Object.entries(this.tState)) this.uState[key].value = value
        gate.resolve()
    })
    await gate.promise

    while (!controller.signal.aborted) await poll()

}

const block:VortexFlow = async function() {
    
    // trigger and refresh the abort controller
    this.controller.value.abort()
    const controller = new AbortController()
    this.controller.value = controller

    // invalidate values in tState as specified by this flow
    for (const key of this.invalidate) this.tState[key] = undefined

    // while there are updaters that need to complete, run all updaters
    while (this.updaters.value.size) {

        const { signal } = controller
        
        await Promise.all([...this.updaters.value].map(updater => {
            const { tState, updaters, flow } = this
            const key = this.dataKey.get(updater) as string
            const dependencies = this.dependencies.get(updater) as string[]
            const operator = new TStateOperator({ tState, key, signal, controller, updater, updaters })
            const datumUpdaterContext = { operator, dependencies, flow }
            return updater.bind(datumUpdaterContext)()
        }))

    }

    const gate = new Gate<void>()
    batch(() => {
        if (!controller.signal.aborted)
            for (const [key, value] of Object.entries(this.tState)) this.uState[key].value = value
        gate.resolve()
    })
    await gate.promise

    while (!controller.signal.aborted) await poll()

}

const flows = { init, chain, account, block } as const satisfies VortexFlows

const data = {
    p1193: {
        invalidatedBy: ['init'],
        dependsOn: [],
        async updater() {
            if (this.operator.get()) return

            // get G1193
            const g1193 = getG1193()

            // create a map from uuid to provider
            const p6963s = new Map<string,P6963>()
            
            // check standard 5749 
            if (g1193.evmproviders) {
                for (const provider of Object.values(g1193.evmproviders)) {
                    const info = provider.info ?? { name: 'Unknown', uuid: crypto.randomUUID(), icon: new Blockie({ scale: 12, seed: [...crypto.getRandomValues(new Uint8Array(20))].map(x => String.fromCharCode(x)).join('') }).base64() }
                    p6963s.set(info.uuid, { provider, info })
                }
            }
            
            // check nonstandard 5749 
            if (g1193.ethereum?.providers) {
                for (const provider of g1193.ethereum.providers) {
                    const info = provider.info ?? { name: 'Unknown', uuid: crypto.randomUUID(), icon: new Blockie({ scale: 12, seed: [...crypto.getRandomValues(new Uint8Array(20))].map(x => String.fromCharCode(x)).join('') }).base64() }
                    p6963s.set(info.uuid, { provider, info })
                }
            }

            // check trustwallet
            if (g1193.trustwallet) {
                const provider = g1193.trustwallet
                const info = provider.info ?? { name: 'TrustWallet', uuid: crypto.randomUUID(), icon: new Blockie({ scale: 12, seed: [...crypto.getRandomValues(new Uint8Array(20))].map(x => String.fromCharCode(x)).join('') }).base64() }
                p6963s.set(info.uuid, { provider, info })
            }

            // check 6963
            globalThis.addEventListener('eip6963:announceProvider', (event:EIP6963AnnounceProviderEvent) => { p6963s.set(event.detail.info.uuid, { ...event.detail }) })
            globalThis.dispatchEvent(new Event('eip6963:requestProvider'))

            // if mobile, check MMSDK
            if (navigator.maxTouchPoints > 0) {
                // @ts-ignore going to see if we can lazy load this since it is too fat for deno deploy
                const { MetaMaskSDK } = (await import('https://unpkg.com/@metamask/sdk@0.18.1/dist/browser/umd/metamask-sdk.js')).default
                // according to metamask this is deceptive and not really synchronous
                const MMSDK = new MetaMaskSDK({ dappMetadata: { name: "DZHV Testnet Faucet", url: window.location.href } })
                // so try to get the provider after an immediate timeout, but use gate to make this somewhat more synchronous
                const gate = new Gate<void>()
                setTimeout(() => {
                    const provider = MMSDK.getProvider() as undefined|P1193&Partial<P5749>
                    if (!provider) { gate.resolve(); return }
                    const info = provider.info ?? { name: 'MetaMask', uuid: crypto.randomUUID(), icon: '"data:image/svg+xml,%3Csvg%20fill%3D%22none%22%20height%3D%2233%22%20viewBox%3D%220%200%2035%2033%22%20width%3D%2235%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%22.25%22%3E%3Cpath%20d%3D%22m32.9582%201-13.1341%209.7183%202.4424-5.72731z%22%20fill%3D%22%23e17726%22%20stroke%3D%22%23e17726%22%2F%3E%3Cg%20fill%3D%22%23e27625%22%20stroke%3D%22%23e27625%22%3E%3Cpath%20d%3D%22m2.66296%201%2013.01714%209.809-2.3254-5.81802z%22%2F%3E%3Cpath%20d%3D%22m28.2295%2023.5335-3.4947%205.3386%207.4829%202.0603%202.1436-7.2823z%22%2F%3E%3Cpath%20d%3D%22m1.27281%2023.6501%202.13055%207.2823%207.46994-2.0603-3.48166-5.3386z%22%2F%3E%3Cpath%20d%3D%22m10.4706%2014.5149-2.0786%203.1358%207.405.3369-.2469-7.969z%22%2F%3E%3Cpath%20d%3D%22m25.1505%2014.5149-5.1575-4.58704-.1688%208.05974%207.4049-.3369z%22%2F%3E%3Cpath%20d%3D%22m10.8733%2028.8721%204.4819-2.1639-3.8583-3.0062z%22%2F%3E%3Cpath%20d%3D%22m20.2659%2026.7082%204.4689%202.1639-.6105-5.1701z%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22m24.7348%2028.8721-4.469-2.1639.3638%202.9025-.039%201.231z%22%20fill%3D%22%23d5bfb2%22%20stroke%3D%22%23d5bfb2%22%2F%3E%3Cpath%20d%3D%22m10.8732%2028.8721%204.1572%201.9696-.026-1.231.3508-2.9025z%22%20fill%3D%22%23d5bfb2%22%20stroke%3D%22%23d5bfb2%22%2F%3E%3Cpath%20d%3D%22m15.1084%2021.7842-3.7155-1.0884%202.6243-1.2051z%22%20fill%3D%22%23233447%22%20stroke%3D%22%23233447%22%2F%3E%3Cpath%20d%3D%22m20.5126%2021.7842%201.0913-2.2935%202.6372%201.2051z%22%20fill%3D%22%23233447%22%20stroke%3D%22%23233447%22%2F%3E%3Cpath%20d%3D%22m10.8733%2028.8721.6495-5.3386-4.13117.1167z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m24.0982%2023.5335.6366%205.3386%203.4946-5.2219z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m27.2291%2017.6507-7.405.3369.6885%203.7966%201.0913-2.2935%202.6372%201.2051z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m11.3929%2020.6958%202.6242-1.2051%201.0913%202.2935.6885-3.7966-7.40495-.3369z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m8.392%2017.6507%203.1049%206.0513-.1039-3.0062z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m24.2412%2020.6958-.1169%203.0062%203.1049-6.0513z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m15.797%2017.9876-.6886%203.7967.8704%204.4833.1949-5.9087z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m19.8242%2017.9876-.3638%202.3584.1819%205.9216.8704-4.4833z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m20.5127%2021.7842-.8704%204.4834.6236.4406%203.8584-3.0062.1169-3.0062z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m11.3929%2020.6958.104%203.0062%203.8583%203.0062.6236-.4406-.8704-4.4834z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m20.5906%2030.8417.039-1.231-.3378-.2851h-4.9626l-.3248.2851.026%201.231-4.1572-1.9696%201.4551%201.1921%202.9489%202.0344h5.0536l2.962-2.0344%201.442-1.1921z%22%20fill%3D%22%23c0ac9d%22%20stroke%3D%22%23c0ac9d%22%2F%3E%3Cpath%20d%3D%22m20.2659%2026.7082-.6236-.4406h-3.6635l-.6236.4406-.3508%202.9025.3248-.2851h4.9626l.3378.2851z%22%20fill%3D%22%23161616%22%20stroke%3D%22%23161616%22%2F%3E%3Cpath%20d%3D%22m33.5168%2011.3532%201.1043-5.36447-1.6629-4.98873-12.6923%209.3944%204.8846%204.1205%206.8983%202.0085%201.52-1.7752-.6626-.4795%201.0523-.9588-.8054-.622%201.0523-.8034z%22%20fill%3D%22%23763e1a%22%20stroke%3D%22%23763e1a%22%2F%3E%3Cpath%20d%3D%22m1%205.98873%201.11724%205.36447-.71451.5313%201.06527.8034-.80545.622%201.05228.9588-.66255.4795%201.51997%201.7752%206.89835-2.0085%204.8846-4.1205-12.69233-9.3944z%22%20fill%3D%22%23763e1a%22%20stroke%3D%22%23763e1a%22%2F%3E%3Cpath%20d%3D%22m32.0489%2016.5234-6.8983-2.0085%202.0786%203.1358-3.1049%206.0513%204.1052-.0519h6.1318z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m10.4705%2014.5149-6.89828%202.0085-2.29944%207.1267h6.11883l4.10519.0519-3.10487-6.0513z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m19.8241%2017.9876.4417-7.5932%202.0007-5.4034h-8.9119l2.0006%205.4034.4417%207.5932.1689%202.3842.013%205.8958h3.6635l.013-5.8958z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"' }
                    p6963s.set(info.uuid, { provider, info })
                    gate.resolve()
                }, 0)
                await gate.promise
            }

            // something like this.operator.set(await connector.choose(providers)))
            if (p6963s.size > 1) this.operator.set(await choose([...p6963s.values()]))
            else if (p6963s.size == 1) this.operator.set((p6963s.values().next().value as P6963).provider)
            else if (g1193.ethereum) this.operator.set(g1193.ethereum)
            else { alert('no web3 providers detected'); this.operator.set(new Error('no web3 providers detected')) }

        },
        schema: sp1193
    },
    chain: {
        invalidatedBy: ['init', 'chain'],
        dependsOn: ['p1193'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const p1193 = this.operator.get('p1193') as P1193
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            const chain = await p1193.request({ method: 'eth_chainId', params: [] })
                .then(z.string().transform(BigInt).parseAsync)
                .catch(reason => new Error(String(reason))) as Error|bigint
            this.operator.set(chain)
                
        },
        schema: z.bigint()
    },
    addresses: {
        invalidatedBy: ['init', 'account'],
        dependsOn: ['p1193'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const p1193 = this.operator.get('p1193') as P1193
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            const addresses = this.flow == 'init'
                ? await p1193.request({ method: 'eth_requestAccounts', params: [] }).catch(reason => {
                    this.operator.controller.abort()
                    for (const key in this.operator.tState) this.operator.tState[key] = undefined
                    vortex.updaters.value = new Set()
                    return new Error(JSON.stringify(reason))
                }) as string[]
                : await p1193.request({ method: 'eth_accounts', params: [] }).catch(reason => new Error(String(reason))) as Error|string[]
            this.operator.set(
                addresses instanceof Error
                    ? addresses
                    : addresses.length
                        ? addresses
                        : new Error('no connected addresses'))
        },
        schema: z.string().array()
    },
    rpc: {
        invalidatedBy: ['init', 'chain'],
        dependsOn: ['chain'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            const chain = await query({ id: this.operator.get('chain') as bigint})
            this.operator.set(
                chain instanceof Error
                    ? chain
                    : chain.rpc[0]
                        ? chain.rpc[0]
                        : new Error(`no rpc for chain ${chain.chainId}`))
        },
        schema: z.string()
    },
    height: {
        invalidatedBy: ['init', 'chain'],
        dependsOn: ['rpc'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            const height = await ejra.height(this.operator.get('rpc') as string)
            this.operator.set(height)
        },
        schema: z.bigint()
    },
    dzhv: {
        invalidatedBy: ['init', 'chain', 'block'],
        dependsOn: ['rpc', 'height'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            const rpc = this.operator.get('rpc') as string
            const address = '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe'
            const height = this.operator.get('height') as bigint
            const code = await ejra.code(rpc, address, height)
            this.operator.set(
                code instanceof Error
                    ? code
                    : code == '0x'
                        ? new Error('dzhv not on this chain')
                        : { address })
        },
        schema: z.object({ address: z.literal('0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe') })
    },
    dzhvBalance: {
        invalidatedBy: ['init', 'chain', 'account', 'block'],
        dependsOn: ['rpc', 'addresses', 'dzhv', 'height'],
        async updater() {
            if (this.operator.get()) return
            if (!this.operator.knows(this.dependencies)) return
            const error = this.operator.errors(this.dependencies)[0] as undefined|Error
            if (error) { this.operator.set(error); return }
            const rpc = this.operator.get('rpc') as string
            const address = (this.operator.get('addresses') as string[])[0] as string
            const dzhv = this.operator.get('dzhv') as { address:string }
            const height = this.operator.get('height') as bigint
            const txCallObject = {
                to: dzhv.address,
                input: `0x70a08231${address.slice(2).padStart(64, '0')}`
            }
            const balance = await ejra.call(rpc, txCallObject, height)
                .then(z.string().transform(BigInt).parseAsync)
                .catch(reason => new Error(reason))
            this.operator.set(balance)
        },
        schema: z.bigint()
    }
} as const satisfies VortexData

const vortex = new Vortex(flows, data)

async function poll() {
    const { controller: { value:controller } } = vortex
    const { rpc, height } = vortex.tState
    if (!rpc || rpc instanceof Error) return
    const newHeight = await ejra.height(rpc)
    if (newHeight instanceof Error) return
    if (height === undefined || height instanceof Error || newHeight <= height) return
    if (controller.signal.aborted) return
    controller.abort() 
    vortex.tState.height = newHeight
    await vortex.flow('block')
}

export { vortex }