import React from 'react';
import Dots from 'react-native-dots-pagination';
import { useTheme } from 'react-native-paper';
import { wp } from 'enevti-app/utils/layout/imageRatio';

interface AppPaginationIndicatorProps {
  length: number;
  active: number;
}

export default React.memo(
  function AppPaginationIndicator({ length, active }: AppPaginationIndicatorProps) {
    const theme = useTheme();
    const passiveSize = '1.2%';
    const activeSize = '1.5%';

    return (
      <Dots
        length={length}
        active={active}
        passiveDotWidth={wp(passiveSize)}
        passiveDotHeight={wp(passiveSize)}
        activeDotWidth={wp(activeSize)}
        activeDotHeight={wp(activeSize)}
        activeColor={theme.colors.primary}
        paddingVertical={0}
        alignDotsOnXAxis={0.1}
      />
    );
  },
  (props, nextProps) => {
    if (props.active === nextProps.active) {
      return true;
    } else {
      return false;
    }
  },
);
