import {
  DimensionFunction,
  hp as heightPercent,
  wp as widthPercent,
} from 'enevti-app/utils/imageRatio';
import useSafeEdgeInsets from 'enevti-app/utils/hook/useSafeEdgeInsets';

export default function useDimension() {
  const insets = useSafeEdgeInsets();
  const hp: DimensionFunction = (height: number | string) => heightPercent(height, insets);
  const wp: DimensionFunction = (width: number | string) => widthPercent(width, insets);
  return { hp, wp };
}
