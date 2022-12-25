import { DimensionFunction, hp as heightPercent, wp as widthPercent } from 'enevti-app/utils/layout/imageRatio';

export default function useDimension() {
  const hp: DimensionFunction = (height: number | string) => heightPercent(height);
  const wp: DimensionFunction = (width: number | string) => widthPercent(width);
  return { hp, wp };
}
