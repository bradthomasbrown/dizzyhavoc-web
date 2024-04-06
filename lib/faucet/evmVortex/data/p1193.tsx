// import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.1/mod.ts";
// import { Blockie } from "../../../blockies/Blockie.ts";
// import * as providers from "../../../state2/providers.ts";
// import { evmVortex } from "../evmVortex.ts";
// import { Which } from "../../../../islands/common/which/Which.tsx";
// import { VortexDatum } from "../../../state2/Vortex.ts";
// import { which } from "../../../../islands/common/Connector.tsx";
// import { Signal } from "@preact/signals";

// function randomUUID() {
//   return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`
//     .replace(
//       /[018]/g,
//       (c) =>
//         (Number(c) ^
//           crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(c) / 4)
//           .toString(16),
//     );
// }

// export const p1193 = {
//   invalidatedBy: ["init"],
//   dependsOn: [],
//   async updater() {
//     if (this.operator.get()) return;
//     const g1193 = providers.getG1193();
//     const pFinder = new ProviderFinder();
//     pFinder.check5749();
//     pFinder.checkTw5749();
//     pFinder.checkTw();
//     pFinder.check6963();
//     await pFinder.checkMmsdk();
//     let provider: undefined | providers.P1193;
//     if (pFinder.count > 1) {
//       const gate = new Gate<providers.P6963>();
//       which.value = pFinder.which(gate);
//       provider = (await gate.promise).provider;
//       which.value = undefined;
//     } else if (pFinder.count == 1) provider = pFinder.first.provider;
//     else if (g1193.ethereum) provider = g1193.ethereum;
//     if (provider) {
//       if (!provider.on && "addListener" in provider) {
//         provider.on = (provider.addListener as providers.P1193["on"]).bind(
//           provider,
//         );
//       }
//       provider.on("chainChanged", () => evmVortex.flow("chain"));
//       provider.on("accountsChanged", () => evmVortex.flow("account"));
//       this.operator.set(provider);
//     } else {
//       alert("no web3 providers detected");
//       this.operator.set(new Error("no web3 providers detected"));
//     }
//   },
//   schema: providers.p1193,
// } as const satisfies VortexDatum

// class ProviderFinder {
//   providers: Map<string, providers.P6963>;
//   constructor() {
//     this.providers = new Map();
//   }
//   check5749() {
//     const g1193 = providers.getG1193();
//     if (g1193.evmproviders) {
//       for (const provider of Object.values(g1193.evmproviders)) {
//         const info = provider.info ?? ProviderFinder.dummyInfo();
//         this.providers.set(info.uuid, { provider, info });
//       }
//     }
//   }
//   checkTw5749() {
//     const g1193 = providers.getG1193();
//     if (g1193.ethereum?.providers) {
//       for (const provider of g1193.ethereum.providers) {
//         const info = provider.info ?? ProviderFinder.dummyInfo();
//         this.providers.set(info.uuid, { provider, info });
//       }
//     }
//   }
//   checkTw() {
//     const g1193 = providers.getG1193();
//     if (g1193.trustwallet) {
//       const provider = g1193.trustwallet.ethereum;
//       const info = provider.info ?? ProviderFinder.dummyInfo();
//       this.providers.set(info.uuid, { provider, info });
//     }
//   }
//   check6963() {
//     globalThis.addEventListener(
//       "eip6963:announceProvider",
//       (event: providers.EIP6963AnnounceProviderEvent) => {
//         this.providers.set(event.detail.info.uuid, { ...event.detail });
//       },
//     );
//     globalThis.dispatchEvent(new Event("eip6963:requestProvider"));
//   }
//   async checkMmsdk() {
//     if (navigator.maxTouchPoints > 0 && ![...this.providers.values()].find(p6963 => p6963.info.name == 'MetaMask')) {
//       const { MetaMaskSDK } = (await import(
//         "https://unpkg.com/@metamask/sdk@0.18.1/dist/browser/umd/metamask-sdk.js"
//       )).default as providers.MmsdkDefault;
//       const MMSDK = new MetaMaskSDK({
//         dappMetadata: {
//           name: "DZHV Testnet Faucet",
//           url: window.location.href,
//         },
//       });
//       const gate = new Gate<void>();
//       setTimeout(() => {
//         const provider = MMSDK.getProvider();
//         if (!provider) {
//           gate.resolve();
//           return;
//         }
//         const info = provider.info ?? {
//           name: "MetaMask",
//           uuid: randomUUID(),
//           icon:
//             'data:image/svg+xml,%3Csvg%20fill%3D%22none%22%20height%3D%2233%22%20viewBox%3D%220%200%2035%2033%22%20width%3D%2235%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%22.25%22%3E%3Cpath%20d%3D%22m32.9582%201-13.1341%209.7183%202.4424-5.72731z%22%20fill%3D%22%23e17726%22%20stroke%3D%22%23e17726%22%2F%3E%3Cg%20fill%3D%22%23e27625%22%20stroke%3D%22%23e27625%22%3E%3Cpath%20d%3D%22m2.66296%201%2013.01714%209.809-2.3254-5.81802z%22%2F%3E%3Cpath%20d%3D%22m28.2295%2023.5335-3.4947%205.3386%207.4829%202.0603%202.1436-7.2823z%22%2F%3E%3Cpath%20d%3D%22m1.27281%2023.6501%202.13055%207.2823%207.46994-2.0603-3.48166-5.3386z%22%2F%3E%3Cpath%20d%3D%22m10.4706%2014.5149-2.0786%203.1358%207.405.3369-.2469-7.969z%22%2F%3E%3Cpath%20d%3D%22m25.1505%2014.5149-5.1575-4.58704-.1688%208.05974%207.4049-.3369z%22%2F%3E%3Cpath%20d%3D%22m10.8733%2028.8721%204.4819-2.1639-3.8583-3.0062z%22%2F%3E%3Cpath%20d%3D%22m20.2659%2026.7082%204.4689%202.1639-.6105-5.1701z%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22m24.7348%2028.8721-4.469-2.1639.3638%202.9025-.039%201.231z%22%20fill%3D%22%23d5bfb2%22%20stroke%3D%22%23d5bfb2%22%2F%3E%3Cpath%20d%3D%22m10.8732%2028.8721%204.1572%201.9696-.026-1.231.3508-2.9025z%22%20fill%3D%22%23d5bfb2%22%20stroke%3D%22%23d5bfb2%22%2F%3E%3Cpath%20d%3D%22m15.1084%2021.7842-3.7155-1.0884%202.6243-1.2051z%22%20fill%3D%22%23233447%22%20stroke%3D%22%23233447%22%2F%3E%3Cpath%20d%3D%22m20.5126%2021.7842%201.0913-2.2935%202.6372%201.2051z%22%20fill%3D%22%23233447%22%20stroke%3D%22%23233447%22%2F%3E%3Cpath%20d%3D%22m10.8733%2028.8721.6495-5.3386-4.13117.1167z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m24.0982%2023.5335.6366%205.3386%203.4946-5.2219z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m27.2291%2017.6507-7.405.3369.6885%203.7966%201.0913-2.2935%202.6372%201.2051z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m11.3929%2020.6958%202.6242-1.2051%201.0913%202.2935.6885-3.7966-7.40495-.3369z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m8.392%2017.6507%203.1049%206.0513-.1039-3.0062z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m24.2412%2020.6958-.1169%203.0062%203.1049-6.0513z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m15.797%2017.9876-.6886%203.7967.8704%204.4833.1949-5.9087z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m19.8242%2017.9876-.3638%202.3584.1819%205.9216.8704-4.4833z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m20.5127%2021.7842-.8704%204.4834.6236.4406%203.8584-3.0062.1169-3.0062z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m11.3929%2020.6958.104%203.0062%203.8583%203.0062.6236-.4406-.8704-4.4834z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m20.5906%2030.8417.039-1.231-.3378-.2851h-4.9626l-.3248.2851.026%201.231-4.1572-1.9696%201.4551%201.1921%202.9489%202.0344h5.0536l2.962-2.0344%201.442-1.1921z%22%20fill%3D%22%23c0ac9d%22%20stroke%3D%22%23c0ac9d%22%2F%3E%3Cpath%20d%3D%22m20.2659%2026.7082-.6236-.4406h-3.6635l-.6236.4406-.3508%202.9025.3248-.2851h4.9626l.3378.2851z%22%20fill%3D%22%23161616%22%20stroke%3D%22%23161616%22%2F%3E%3Cpath%20d%3D%22m33.5168%2011.3532%201.1043-5.36447-1.6629-4.98873-12.6923%209.3944%204.8846%204.1205%206.8983%202.0085%201.52-1.7752-.6626-.4795%201.0523-.9588-.8054-.622%201.0523-.8034z%22%20fill%3D%22%23763e1a%22%20stroke%3D%22%23763e1a%22%2F%3E%3Cpath%20d%3D%22m1%205.98873%201.11724%205.36447-.71451.5313%201.06527.8034-.80545.622%201.05228.9588-.66255.4795%201.51997%201.7752%206.89835-2.0085%204.8846-4.1205-12.69233-9.3944z%22%20fill%3D%22%23763e1a%22%20stroke%3D%22%23763e1a%22%2F%3E%3Cpath%20d%3D%22m32.0489%2016.5234-6.8983-2.0085%202.0786%203.1358-3.1049%206.0513%204.1052-.0519h6.1318z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m10.4705%2014.5149-6.89828%202.0085-2.29944%207.1267h6.11883l4.10519.0519-3.10487-6.0513z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m19.8241%2017.9876.4417-7.5932%202.0007-5.4034h-8.9119l2.0006%205.4034.4417%207.5932.1689%202.3842.013%205.8958h3.6635l.013-5.8958z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E',
//         };
//         this.providers.set(info.uuid, { provider, info });
//         gate.resolve();
//       }, 0);
//       await gate.promise;
//     }
//   }
//   get first(): providers.P6963 {
//     return this.providers.values().next().value;
//   }
//   get all(): providers.P6963[] {
//     return [...this.providers.values()];
//   }
//   get count(): number {
//     return this.providers.size;
//   }
//   which(gate: Gate<providers.P6963>): ReturnType<typeof Which> {
//     return (
//       <Which
//         title="choose a provider"
//         choices={new Signal(this.all.map((p6963) => ({
//           id: p6963.info.name,
//           src: p6963.info.icon,
//           value: p6963,
//           space: p6963.info.name,
//         })))}
//         onPick={(choice) => gate.resolve(choice.value)}
//       />
//     );
//   }
//   static dummyInfo(): providers.P5749Info {
//     return {
//       name: "Unknown",
//       uuid: randomUUID(),
//       icon: Blockie.randB64(),
//     };
//   }
// }
