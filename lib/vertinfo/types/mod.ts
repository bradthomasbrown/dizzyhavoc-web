export type EconConf = {
  gasLimitMultiplier: [numerator: bigint, denominator: bigint];
  gasPriceMultiplier: [numerator: bigint, denominator: bigint];
  baseFee: bigint;
};