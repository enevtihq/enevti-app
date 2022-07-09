import { TemplateIdAsset } from '../id';

export type AllNFTTemplate = {
  items: TemplateIdAsset[];
};

export interface TemplateArgs {
  x: string;
  y: string;
  width: string;
  height: string;
  rotate: string;
}

export type NFTTemplateItem = {
  type:
    | 'utility-background'
    | 'utility-icon'
    | 'utility-label'
    | 'partition-icon'
    | 'partition-label'
    | 'data'
    | 'data-box'
    | 'box'
    | 'rarity-icon'
    | 'rarity-rank'
    | 'rarity-percent'
    | 'name'
    | 'serial'
    | string;
  args: TemplateArgs;
};

export type NFTTemplate = NFTTemplateItem[];

export type NFTTemplateData = {
  main: NFTTemplate;
  thumbnail: NFTTemplate;
};

export type NFTTemplateAsset = {
  readonly id: string;
  name: string;
  description: string;
  data: NFTTemplateData;
};
