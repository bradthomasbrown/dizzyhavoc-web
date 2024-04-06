// import z from "https://deno.land/x/zod@v3.22.4/index.ts";

// declare global {
//   interface WindowEventMap {
//     "eip6963:announceProvider": EIP6963AnnounceProviderEvent;
//   }
// }

// interface Mmsdk {
//   getProvider: () => undefined | (P1193 & Partial<P5749>);
// }

// export type MmsdkDefault = {
//   MetaMaskSDK: {
//     new (dappMetaData: { dappMetadata: { name: string; url: string } }): Mmsdk;
//   };
// };

// type Tx = {
//   from?: string;
//   to?: string;
//   data?: string;
//   value?: bigint;
// };

// export const p1193 = z.object({
//   request: z.function().args(
//     z.object({ method: z.string(), params: z.unknown().array() }),
//   ).returns(z.unknown().promise()),
//   on: z.function().args(
//     z.string(),
//     z.function().args(z.any()).returns(z.void()),
//   ),
// });

// export type P1193 = z.infer<typeof p1193>;

// export type P5749Info = { name: string; icon: string; uuid: string };

// export type P5749 = P1193 & { info: P5749Info };

// export type P6963 = { provider: P1193 } & { info: P5749Info };

// export interface EIP6963AnnounceProviderEvent extends CustomEvent {
//   type: "eip6963:announceProvider";
//   detail: P6963;
// }

// type G1193 =
//   & typeof globalThis
//   & {
//     ethereum?: P1193 & Partial<P5749> & {
//       providers?: Array<P1193 & Partial<P5749>>;
//     };
//   }
//   & { trustwallet?: { ethereum: P1193 & Partial<P5749> } }
//   & { evmproviders?: { [key: string]: P1193 & Partial<P5749> } };

// export function getG1193(): G1193 {
//   return globalThis;
// }
