export type DynamicBaseFeeGenesisConfig = {
  dynamicBaseFees?: { moduleID: number; assetID: number; minFeePerByte: number }[];
  defaultMinFeePerByte?: number;
};
