/** bigint to string, given decimals */
export function btos(b: bigint, decimals: number) {
  // padleft with zeros up to decimals length
  const tmp = String(b).padStart(Number(decimals), "0");
  // array from tmp
  const tmpa = Array.from(tmp);
  // new tmp, decimal and last {decimal} digits
  let tmp2 = `.${tmpa.splice(-18).join("")}`;
  // add the rest of the digits, or a zero if there are none
  tmp2 = `${tmpa.join("") == "" ? "0" : tmpa.join("")}${tmp2}`;
  // remove trailing zeros
  tmp2 = tmp2.replace(/0*$/, "");
  // remove decimal if it's the last char
  tmp2 = tmp2.replace(/\.$/, "");
  // if there's nothing left, return a '0'
  return tmp2 ? tmp2 : "0";
}
