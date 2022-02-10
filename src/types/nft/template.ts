interface TemplateArgs {
  x?: number;
  y?: number;
  translateX?: number;
  translateY?: number;
  width?: number;
  height?: number;
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

export type NFTTemplateItem =
  | NFTUtilityBackgroundTemplate
  | NFTUtilityIconTemplate
  | NFTUtilityTextTemplate
  | NFTPartitionIconTemplate;

export type NFTTemplate = NFTTemplateItem[];
