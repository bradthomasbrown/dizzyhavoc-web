// query will try to pull from this list of Chains first
export const overrides = [
    {
        name: 'Testnet 8545',
        chain: 'T8545',
        rpc: ['http://localhost:8545'],
        chainId: 8545,
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimal: 18
        },
        explorers: [],
        icon: 'ethereum',
        shortName: 't5'
    },
    {
        name: 'Testnet 8546',
        chain: 'T8546',
        rpc: ['http://localhost:8546'],
        chainId: 8546,
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimal: 18
        },
        explorers: [],
        icon: 'ethereum',
        shortName: 't6'
    }
]