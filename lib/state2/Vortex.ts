import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { Signal } from '@preact/signals'

export type TStateGetContext = {
    tState:TState
    key:string
}

export type TStateSetContext = {
    tState:TState
    signal:AbortSignal
    updater:DatumUpdater
    updaters:Set<DatumUpdater>
    key:string
}

export type TStateGet = (this:TStateGetContext)=>unknown

export type TStateSet = (this:TStateSetContext, value:unknown)=>Error|void

export class TStateOperator {

    tState:TState
    signal:AbortSignal
    controller:AbortController
    updater:DatumUpdater
    updaters:Signal<Set<DatumUpdater>>
    key:string

    constructor({ tState, key, signal, controller, updater, updaters }:{
        tState:TState
        signal:AbortSignal
        controller:AbortController
        updater:DatumUpdater
        updaters:Signal<Set<DatumUpdater>>
        key:string
    }) {
        this.tState = tState
        this.signal = signal
        this.controller = controller
        this.updater = updater
        this.updaters = updaters
        this.key = key 
    }

    get(key?:string) { return this.tState[key ?? this.key] }

    set(value:unknown) {
        if (this.signal.aborted) return new Error('TStateSet: signal aborted')
        this.tState[this.key] = value
        const s = new Set(this.updaters.value)
        s.delete(this.updater)
        this.updaters.value = s
    }

    knows(dependencies:string[]):boolean {
        return !dependencies.map(key => this.tState[key]).includes(undefined)
    }

    errors(dependencies:string[]):Error[] {
        return dependencies.map(key => this.tState[key]).filter(value => value instanceof Error) as Error[]
    }

}

export type TState = Record<string,unknown>

type TStateSpecific<D extends VortexData> = {
    -readonly [K in keyof D]: undefined|Error|z.infer<D[K]['schema']>
}

export type UState = Record<string,Signal<unknown>>

type UStateSpecific<D extends VortexData> = {
    -readonly [K in keyof D]: Signal<undefined|Error|z.infer<D[K]['schema']>>
}

type FlowContext = {
    controller:{ value: AbortController }
    tState:TState
    dependencies:Map<DatumUpdater,string[]>
    invalidate:Set<string>
    updaters:Signal<Set<DatumUpdater>>
    dataKey:Map<DatumUpdater,string>
    flow:string
    uState:UState
}

export type VortexFlow = (this:FlowContext)=>void|Promise<void>

export type VortexFlows = Record<string,VortexFlow>

type DatumUpdaterContext = {
    operator:TStateOperator
    dependencies:string[]
    flow:string
}

export type DatumUpdater = (this:DatumUpdaterContext)=>void|Promise<void>

type VortexDatum = {
    invalidatedBy:string[]
    dependsOn:string[]
    updater:DatumUpdater
    schema:z.ZodTypeAny
}

export type VortexData = Record<string,VortexDatum>

export class Vortex<F extends VortexFlows, D extends VortexData> {

    flows:F
    data:D
    tState:TStateSpecific<D>
    controller:{ value: AbortController }
    updaters:Signal<Set<DatumUpdater>>
    dependencies:Map<DatumUpdater,string[]>
    dataKey:Map<DatumUpdater,string>
    uState:UStateSpecific<D>

    constructor(flows:F, data:D) {
        this.flows = flows
        this.data = data
        this.tState = Object.fromEntries(Object.entries(data).map(([k]) => [k, undefined])) as TStateSpecific<D>
        this.controller = { value: new AbortController() }
        this.updaters = new Signal(new Set())
        this.dependencies = new Map(
            Object.values(data)
                .map(({ updater, dependsOn }) => [updater, dependsOn]))
        this.dataKey = new Map(
            Object.entries(data)
                .map(([key, { updater }]) => [updater, key]))
        this.uState = Object.fromEntries(Object.entries(data).map(([k]) => [k, new Signal(undefined)])) as UStateSpecific<D>
    }

    flow<K extends Extract<keyof this['flows'],string>>(flow:K) {
        // pull needed data out of this Vortex
        const { controller, dependencies, tState, updaters, dataKey, uState, ..._ } = this
        // create set of data keys to invalidate
        const invalidate = new Set(
            Object.entries(this.data)            
                .filter(([_,v]) => v.invalidatedBy.includes(flow))
                .map(([k,_]) => k))
        // add updaters for invalidated keys to this Vortex's updater set
        const s = new Set(updaters.value)
        for (const k of invalidate) s.add(this.data[k].updater)
        updaters.value = s
        // create context to pass to flow
        const context = { controller, tState, dependencies, updaters, invalidate, dataKey, flow, uState }
        // call flow with context bound
        return this.flows[flow].bind(context)() as ReturnType<F[K]>
    }

}

// const flowParams = {
//     invalidate: ['foo'],
//     updaters: [async () => {}]
// } as const

// const flows = { init: flowParams }

// const schema = { flows }

// export const vortex = new Vortex(schema)

// vortex

// vortex.flow('init')