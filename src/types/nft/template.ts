export interface TemplateArgs {
  x: string;
  y: string;
  width: string;
  height: string;
}

export type NFTTemplateItem = {
  type:
    | 'utility-background'
    | 'utility-icon'
    | 'utility-text'
    | 'partition-icon'
    | 'data'
    | 'data-box'
    | 'box';
  args: TemplateArgs;
};

export type NFTTemplate = NFTTemplateItem[];
