import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppListItem from '../molecules/list/AppListItem';
import { hp, SafeAreaInsets, wp } from '../../utils/imageRatio';
import AppBrandLogo from '../atoms/brand/AppBrandLogo';
import AppTextBody4 from '../atoms/text/AppTextBody4';
import { getCoinName } from '../atoms/brand/AppBrandConstant';
import { StyleSheet, View } from 'react-native';
import Color from 'color';
import { Theme } from '../../theme/default';
import { useTheme } from 'react-native-paper';

interface AppCoinChipsPickerProps {
  active?: boolean;
  error?: boolean;
}

export default function AppCoinChipsPicker({
  active,
  error,
}: AppCoinChipsPickerProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets);

  const height = hp(active ? '4.9%' : error ? '5.2%' : '4.9%', insets);
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

const makeStyle = (insets: SafeAreaInsets) =>
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
