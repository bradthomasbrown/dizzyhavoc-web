import { schemas, overrides } from '../internal.ts'

// query overrides and then ethereum-lists/chains for chain info
export async function query({ id }:{ id:bigint }) {

    // search overrides for chain
    const override = overrides.find(({ chainId }) => BigInt(chainId) == id)
    // otherwise attempt to pull and parse chain from lib/chains/ 
    const chain = override
        ? null
        : await fetch(`https://cdn.jsdelivr.net/gh/ethereum-lists/chains/_data/chains/eip155-${id}.json`)
            .then(response => response.json())
            .then(schemas.chain.parseAsync)
            .catch(() => null)

    return override ?? chain 

}