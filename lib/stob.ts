/** string to bigint, given decimals */
export function stob(s: string, decimals: number) {
  // add a decimal to the end of the string if there isn't one
  if (!s.match(/\./)) s = `${s}.`;
  // get index of decimal
  const index = s.indexOf(".");
  // calculate number of zeros to add to end of string
  const zeros = decimals - (s.length - 1 - index);
  // if this is negative, truncate
  if (zeros < 0) s = s.slice(0, zeros);
  // if positive, add zeros
  if (zeros > 0) s = `${s}${"".padEnd(zeros, "0")}`;
  // remove the decimal
  s = s.replace(/\./, "");
  // return as bigint
  return BigInt(s);
}
