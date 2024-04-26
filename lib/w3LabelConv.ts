const prefixes = [
  "q",
  "r",
  "y",
  "z",
  "a",
  "f",
  "p",
  "n",
  "μ",
  "m",
  "",
  "k",
  "M",
  "G",
  "T",
  "P",
  "E",
  "Z",
  "Y",
  "R",
  "Q",
];

type W3LabelConvOpts = {
  big: bigint;
  dec: number;
  sym: string;
  tarLen: number;
  maxExt: number;
};

/**
 * Web3 label converter for bigints
 * @param opts.n the bigint to be converted
 * @param opts.decimals the decimals of the currency
 * @param opts.symbol the symbol of the currency
 * @param opts.tarLen the target length of the string representation
 * @param opts.maxExt the max extra fractional length
 * @returns
 */
const w3LabelConv = (opts: W3LabelConvOpts) => {
  let { big, dec, sym, tarLen, maxExt } = opts;
  if (tarLen < 9 - 4 + sym.length) throw new Error("tarLen too low");
  if (!tarLen) tarLen = Infinity;
  if (!maxExt) maxExt = Infinity;
  // string representation of number
  const s = "" + big;
  // magnitude of our number considering decimals where 0 is the lowest (one quecto)
  const mag = s.length - dec - 1 + 30;
  // metric prefix index
  const index = Math.floor(mag / 3);
  // length of whole numbers
  const intLen = mag % 3 + 1;
  // integer portion
  const int = s.slice(0, intLen);
  // fraction portion
  let frac = "." + s.slice(intLen);
  // remaining length
  const rem = tarLen - intLen - frac.length - 1 - (index != 10 ? 1 : 0) -
    sym.length;
  // if tarLen isn't Infinity, pad or slice frac to remaining length
  if (tarLen < Infinity) {
    if (rem > 0) frac = frac.padEnd(frac.length + rem, "0");
    else frac = frac.slice(0, frac.length + rem);
  }
  // if frac here is just a dot, remove it
  if (frac.length == 1) frac = "";
  // make sure not to defy maxExt
  frac = frac.slice(0, maxExt + 1);
  // prefix
  const prefix = prefixes[index];
  // pad number with zeroes to length
  const formattedFrac = Number(`${frac}`).toFixed(1);
  // remove if line causes problems ^
  return `${int}${formattedFrac.slice(1)}${prefix} ${sym}`;
};

export { w3LabelConv };