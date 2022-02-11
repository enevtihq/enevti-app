export interface TemplateArgs {
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  size?: number;
}

interface NFTUtilityBackgroundTemplate {
  type: 'utility-background';
  args?: TemplateArgs;
}

interface NFTUtilityIconTemplate {
  type: 'utility-icon';
  args?: TemplateArgs;
}

interface NFTUtilityTextTemplate {
  type: 'utility-text';
  args?: TemplateArgs;
}

interface NFTPartitionIconTemplate {
  type: 'partition-icon';
  args?: TemplateArgs;
}

interface NFTData {
  type: 'data';
  args?: TemplateArgs;
}

interface NFTDataBox {
  type: 'data-box';
  args?: TemplateArgs;
}

export type NFTTemplateItem =
  | NFTUtilityBackgroundTemplate
  | NFTUtilityIconTemplate
  | NFTUtilityTextTemplate
  | NFTPartitionIconTemplate
  | NFTData
  | NFTDataBox;

export type NFTTemplate = NFTTemplateItem[];
