// import { DAppState, TState } from "../internal.ts";

// export async function updateTState({
//     tState, updaters, abortController
// }:{
//     tState:TState,
//     updaters:Array<
//         ({ tState, abortController }:{
//             tState:DAppState, abortController:AbortController
//         }) => Promise<void>
//     >
//     abortController:AbortController
// }) {
//     let i = 0
//     while (Object.values(tState).includes(undefined)) {
//         if (abortController.signal.) break
//         console.log(Object.fromEntries(Object.entries(tState).map(([k,v])=>[k,!!v])), i++)
//         await Promise.all(updaters.map(updater => updater({
//             tState, abortController })))
//         await new Promise(r => setTimeout(r, 1000))
//     }
// } 