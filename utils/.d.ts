type DAppState = {
    provider:undefined|z.infer<typeof foo>|null,
    chainId:undefined|bigint|null,
    addresses:undefined|string[]|null,
    height:undefined|bigint|null
    balance:undefined|bigint|null,
    dzhv:undefined|{ address:string }|null,
    dzhvBalance:undefined|bigint|null,
    rpc:undefined|string|null
    nonce:undefined|bigint|null
}