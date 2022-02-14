import React from 'react';
import Dots from 'react-native-dots-pagination';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { wp } from '../../../utils/imageRatio';

interface AppPaginationIndicatorProps {
  length: number;
  active: number;
}

export default function AppPaginationIndicator({
  length,
  active,
}: AppPaginationIndicatorProps) {
  const insets = useSafeAreaInsets();
  const passiveSize = '2%';
  const activeSize = '2%';

  return (
    <Dots
      length={length}
      active={active}
      passiveDotWidth={wp(passiveSize, insets)}
      passiveDotHeight={wp(passiveSize, insets)}
      activeDotWidth={wp(activeSize, insets)}
      activeDotHeight={wp(activeSize, insets)}
      paddingVertical={0}
      alignDotsOnXAxis={0.1}
    />
  );
}
