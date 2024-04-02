export function hexshort(hex: string) {
  return `${hex.slice(0, 5)}...${hex.slice(-3)}`;
}
