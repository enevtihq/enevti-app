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
    | 'serial';
  args: TemplateArgs;
};

export type NFTTemplate = NFTTemplateItem[];
