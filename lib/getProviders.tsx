import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.1/mod.ts";
import { Blockie, Choice, dzkv, randomUuid, toad } from "lib/mod.ts";
import { Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { Which } from "islands/common/mod.ts";
import { Connector, ConnectorState } from "islands/common/mod.ts";
import { query } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/mod.ts";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import { data } from "lib/bridge/mod.ts";
import { Lazy } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/lazy@0.0.0/mod.ts";
import { Snail } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/snail@0.0.3/mod.ts";

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": A6963;
  }
}

export const p1193 = z.object({
  request: z.function().args(
    z.object({ method: z.string(), params: z.unknown().array() }),
  ).returns(z.unknown().promise()),
  on: z.function().args(
    z.string(),
    z.function().args(z.any()).returns(z.void()),
  ),
});

type P1193 = z.infer<typeof p1193>;
type I5749 = { name: string; icon: string; uuid: string };
type P5749 = P1193 & { info: I5749 };
export type P6963 = { provider: P1193 } & { info: I5749 };
interface A6963 extends CustomEvent {
  type: "eip6963:announceProvider";
  detail: P6963;
}
type G1193 =
  & typeof globalThis
  & {
    ethereum?: P1193 & Partial<P5749> & {
      providers?: Array<P1193 & Partial<P5749>>;
    };
  }
  & { trustwallet?: { ethereum: P1193 & Partial<P5749> } }
  & { evmproviders?: { [key: string]: P1193 & Partial<P5749> } };
interface Mmsdk {
  getProvider: () => undefined | (P1193 & Partial<P5749>);
}
export type MmsdkDefault = {
  MetaMaskSDK: {
    new (dappMetaData: { dappMetadata: { name: string; url: string } }): Mmsdk;
  };
};
type ProviderMap = Map<string, P6963>;

function g1193(): G1193 {
  return globalThis;
}

function dummyInfo() {
  return { name: "Unknown", uuid: randomUuid(), icon: Blockie.randB64() };
}

export async function getProviders() {
  const providers: ProviderMap = new Map();
  const g = g1193();

  // check 5749
  if (g.evmproviders) {
    for (const provider of Object.values(g.evmproviders)) {
      const info = provider.info ?? dummyInfo();
      providers.set(info.uuid, { provider, info });
    }
  }

  // check TW5749
  if (g.ethereum?.providers) {
    for (const provider of g.ethereum.providers) {
      const info = provider.info ?? dummyInfo();
      providers.set(info.uuid, { provider, info });
    }
  }

  // check TW
  if (g.trustwallet) {
    const provider = g.trustwallet.ethereum;
    const info = provider.info ?? dummyInfo();
    providers.set(info.uuid, { provider, info });
  }

  // check 6963
  function handleA6963(e: A6963) {
    providers.set(e.detail.info.uuid, { ...e.detail });
  }
  g.addEventListener("eip6963:announceProvider", handleA6963);
  g.dispatchEvent(new Event("eip6963:requestProvider"));
  g.removeEventListener("eip6963:announceProvider", handleA6963);

  // if mobile and don't already have a metamask provider, check MMSDK
  if (
    navigator.maxTouchPoints > 0 &&
    ![...providers.values()].find((p) => p.info.name == "MetaMask")
  ) {
    const { MetaMaskSDK } = (await import(
      "https://unpkg.com/@metamask/sdk@0.18.1/dist/browser/umd/metamask-sdk.js"
    )).default as MmsdkDefault;
    const mmsdk = new MetaMaskSDK({
      dappMetadata: { name: "DZHV Testnet Faucet", url: window.location.href },
    });
    const gate = new Gate<void>();
    setTimeout(() => {
      const provider = mmsdk.getProvider();
      if (!provider) {
        gate.resolve();
        return;
      }
      const info = provider.info ?? dummyInfo();
      info.icon =
        "data:image/svg+xml,%3Csvg%20fill%3D%22none%22%20height%3D%2233%22%20viewBox%3D%220%200%2035%2033%22%20width%3D%2235%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%22.25%22%3E%3Cpath%20d%3D%22m32.9582%201-13.1341%209.7183%202.4424-5.72731z%22%20fill%3D%22%23e17726%22%20stroke%3D%22%23e17726%22%2F%3E%3Cg%20fill%3D%22%23e27625%22%20stroke%3D%22%23e27625%22%3E%3Cpath%20d%3D%22m2.66296%201%2013.01714%209.809-2.3254-5.81802z%22%2F%3E%3Cpath%20d%3D%22m28.2295%2023.5335-3.4947%205.3386%207.4829%202.0603%202.1436-7.2823z%22%2F%3E%3Cpath%20d%3D%22m1.27281%2023.6501%202.13055%207.2823%207.46994-2.0603-3.48166-5.3386z%22%2F%3E%3Cpath%20d%3D%22m10.4706%2014.5149-2.0786%203.1358%207.405.3369-.2469-7.969z%22%2F%3E%3Cpath%20d%3D%22m25.1505%2014.5149-5.1575-4.58704-.1688%208.05974%207.4049-.3369z%22%2F%3E%3Cpath%20d%3D%22m10.8733%2028.8721%204.4819-2.1639-3.8583-3.0062z%22%2F%3E%3Cpath%20d%3D%22m20.2659%2026.7082%204.4689%202.1639-.6105-5.1701z%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22m24.7348%2028.8721-4.469-2.1639.3638%202.9025-.039%201.231z%22%20fill%3D%22%23d5bfb2%22%20stroke%3D%22%23d5bfb2%22%2F%3E%3Cpath%20d%3D%22m10.8732%2028.8721%204.1572%201.9696-.026-1.231.3508-2.9025z%22%20fill%3D%22%23d5bfb2%22%20stroke%3D%22%23d5bfb2%22%2F%3E%3Cpath%20d%3D%22m15.1084%2021.7842-3.7155-1.0884%202.6243-1.2051z%22%20fill%3D%22%23233447%22%20stroke%3D%22%23233447%22%2F%3E%3Cpath%20d%3D%22m20.5126%2021.7842%201.0913-2.2935%202.6372%201.2051z%22%20fill%3D%22%23233447%22%20stroke%3D%22%23233447%22%2F%3E%3Cpath%20d%3D%22m10.8733%2028.8721.6495-5.3386-4.13117.1167z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m24.0982%2023.5335.6366%205.3386%203.4946-5.2219z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m27.2291%2017.6507-7.405.3369.6885%203.7966%201.0913-2.2935%202.6372%201.2051z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m11.3929%2020.6958%202.6242-1.2051%201.0913%202.2935.6885-3.7966-7.40495-.3369z%22%20fill%3D%22%23cc6228%22%20stroke%3D%22%23cc6228%22%2F%3E%3Cpath%20d%3D%22m8.392%2017.6507%203.1049%206.0513-.1039-3.0062z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m24.2412%2020.6958-.1169%203.0062%203.1049-6.0513z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m15.797%2017.9876-.6886%203.7967.8704%204.4833.1949-5.9087z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m19.8242%2017.9876-.3638%202.3584.1819%205.9216.8704-4.4833z%22%20fill%3D%22%23e27525%22%20stroke%3D%22%23e27525%22%2F%3E%3Cpath%20d%3D%22m20.5127%2021.7842-.8704%204.4834.6236.4406%203.8584-3.0062.1169-3.0062z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m11.3929%2020.6958.104%203.0062%203.8583%203.0062.6236-.4406-.8704-4.4834z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m20.5906%2030.8417.039-1.231-.3378-.2851h-4.9626l-.3248.2851.026%201.231-4.1572-1.9696%201.4551%201.1921%202.9489%202.0344h5.0536l2.962-2.0344%201.442-1.1921z%22%20fill%3D%22%23c0ac9d%22%20stroke%3D%22%23c0ac9d%22%2F%3E%3Cpath%20d%3D%22m20.2659%2026.7082-.6236-.4406h-3.6635l-.6236.4406-.3508%202.9025.3248-.2851h4.9626l.3378.2851z%22%20fill%3D%22%23161616%22%20stroke%3D%22%23161616%22%2F%3E%3Cpath%20d%3D%22m33.5168%2011.3532%201.1043-5.36447-1.6629-4.98873-12.6923%209.3944%204.8846%204.1205%206.8983%202.0085%201.52-1.7752-.6626-.4795%201.0523-.9588-.8054-.622%201.0523-.8034z%22%20fill%3D%22%23763e1a%22%20stroke%3D%22%23763e1a%22%2F%3E%3Cpath%20d%3D%22m1%205.98873%201.11724%205.36447-.71451.5313%201.06527.8034-.80545.622%201.05228.9588-.66255.4795%201.51997%201.7752%206.89835-2.0085%204.8846-4.1205-12.69233-9.3944z%22%20fill%3D%22%23763e1a%22%20stroke%3D%22%23763e1a%22%2F%3E%3Cpath%20d%3D%22m32.0489%2016.5234-6.8983-2.0085%202.0786%203.1358-3.1049%206.0513%204.1052-.0519h6.1318z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m10.4705%2014.5149-6.89828%202.0085-2.29944%207.1267h6.11883l4.10519.0519-3.10487-6.0513z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3Cpath%20d%3D%22m19.8241%2017.9876.4417-7.5932%202.0007-5.4034h-8.9119l2.0006%205.4034.4417%207.5932.1689%202.3842.013%205.8958h3.6635l.013-5.8958z%22%20fill%3D%22%23f5841f%22%20stroke%3D%22%23f5841f%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";
      providers.set(info.uuid, { provider, info });
      gate.resolve();
    }, 0);
    await gate.promise;
  }

  // handler here if there is only one provider

  if (providers.size == 1) {
    onPick(providers.values().next().value as P6963);
    return;
  }

  function providerToChoice(p: P6963): Choice<P6963> {
    return { id: p.info.name, src: p.info.icon, value: p, space: p.info.name };
  }

  const title = "pick a provider";
  const choices = new Signal([...providers.values()].map(providerToChoice));

  const which = <Which {...{ title, choices, onPick }} />;
  dzkv.get<Signal<null | JSX.Element>>(["which"])!.value = which;
}

async function onPick(p6963: P6963) {
  // set connector to loading, handle account changes, request accounts
  Connector.set(ConnectorState.LOADING);
  await p6963.provider.request({ method: "eth_requestAccounts", params: [] })
    .then(z.string().array().parseAsync)
    .then((accounts) => onAccountsChanged(accounts))
    // if user rejects, clear which and re-ready connector
    .catch(() => Connector.set(ConnectorState.READY));
  p6963.provider.on("accountsChanged", onAccountsChanged);
  p6963.provider.on(
    "chainChanged",
    (s) =>
      z.string().transform((s) => Number(BigInt(s))).parseAsync(s)
        .then((chainId) => onChainChanged(chainId))
        .catch((reason: Error) => console.error(reason)),
  );

  // clear which
  dzkv.get<Signal<null | JSX.Element>>(["which"])!.value = null;

  p6963.provider.request({ method: "eth_chainId", params: [] })
    .then(z.string().transform((s) => Number(BigInt(s))).parseAsync)
    .then((chainId) => onChainChanged(chainId))
    .catch((reason: Error) => console.error(reason));
}

function onAccountsChanged(accounts: string[]) {
  if (!accounts.length) Connector.set(ConnectorState.READY);
  if (String(accounts) === String(data.addresses.get())) return;
  const value = accounts;
  const state: data.addresses.State = { value };
  data.addresses.set(state);
}

function onChainChanged(chainId: number) {
  const parts = ["from"];
  const subKey: data.chainId.SubKey = [...parts];
  const subState: data.chainId.SubState = { parts };
  const value = chainId;
  const state: data.chainId.State = { subState, value };
  data.chainId.set(subKey, state);
}
