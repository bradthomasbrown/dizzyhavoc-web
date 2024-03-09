import { schemas, overrides } from '../internal.ts'

export async function query({ id }:{ id:bigint }) {

    // search overrides for chain
    const override = overrides.find(({ chainId }) => BigInt(chainId) == id)
    // otherwise attempt to pull and parse chain from lib/chains/ 
    const chain = override
        ? null
        : await import(`./chains/_data/chains/eip155-${id}.json`, { with: { type: 'json' } })
            .then(maybeChain => schemas.chain.parseAsync(maybeChain))
            .catch(() => null)

    return override ?? chain 

}