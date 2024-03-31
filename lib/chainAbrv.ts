/**
 * A function that maps chain IDs to abbreviations.
 * Basically custom short names because ethereum/chain-list's short names
 * can get very weird.
 */
export function chainAbrv(chainId:number):string {
  switch(chainId) {
    case 11155111: return 'tETH-SEP'
    case 421614: return 'tARB-SEP'
    case 97: return 'tBSC'
    case 43113: return 'tAVAX'
    case 84532: return 'tBASE-SEP'
    default: return ''
  }
}