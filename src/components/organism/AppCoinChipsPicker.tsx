import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppListItem from '../molecules/list/AppListItem';
import { SafeAreaInsets, wp } from '../../utils/imageRatio';
import AppBrandLogo from '../atoms/brand/AppBrandLogo';
import AppTextBody4 from '../atoms/text/AppTextBody4';
import { getCoinName } from '../atoms/brand/AppBrandConstant';
import { StyleSheet, View } from 'react-native';

export default function AppCoinChipsPicker() {
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets);

  return (
    <AppListItem
      style={styles.container}
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
