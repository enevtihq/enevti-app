import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppBrandLogo from 'enevti-app/components/atoms/brand/AppBrandLogo';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { getCoinName } from 'enevti-app/components/atoms/brand/AppBrandConstant';
import { StyleSheet, View } from 'react-native';
import Color from 'color';
import { Theme } from 'enevti-app/theme/default';
import { useTheme } from 'react-native-paper';

interface AppCoinChipsPickerProps {
  active?: boolean;
  error?: boolean;
  dense?: boolean;
}

function Component({ active, error, dense = false }: AppCoinChipsPickerProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const denseHeight = active ? '4.9%' : error ? '5.2%' : '4.9%';
  const normalHeight = active ? '7.25%' : error ? '7.55%' : '7.25%';

  const height = hp(dense ? denseHeight : normalHeight, insets);
  const borderWidth = active ? 2 : error ? 1 : 2;
  const borderColor = error
    ? theme.colors.error
    : active
    ? theme.colors.primary
    : theme.dark
    ? Color(theme.colors.background).lighten(0.5).rgb().string()
    : Color(theme.colors.background).darken(0.05).rgb().string();

  return (
    <AppListItem
      style={[styles.container, { height }]}
      containerStyle={[styles.itemContainer, { borderColor, borderWidth }]}
      leftContent={
        <View style={styles.coinLogo}>
          <AppBrandLogo widthPercentage={0.05} />
        </View>
      }>
      <AppTextBody4 style={styles.coinLabel}>{getCoinName()}</AppTextBody4>
    </AppListItem>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      width: wp('23%', insets),
    },
    itemContainer: {
      marginHorizontal: 0,
      marginVertical: 0,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      borderLeftWidth: 0,
    },
    coinLogo: {
      marginLeft: -3,
      marginRight: -5,
      alignSelf: 'center',
    },
    coinLabel: {
      width: wp('15%', insets),
      textAlign: 'center',
      paddingTop: 1,
    },
  });

const AppCoinChipsPicker = React.memo(Component);
export default AppCoinChipsPicker;
