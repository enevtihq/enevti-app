import React from 'react';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import { wp } from 'enevti-app/utils/layout/imageRatio';
import AppBrandLogo from 'enevti-app/components/atoms/brand/AppBrandLogo';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { getCoinName } from 'enevti-app/utils/constant/identifier';
import { StyleSheet, View } from 'react-native';

interface AppCoinChipsPickerProps {
  dense?: boolean;
}

function Component({ dense }: AppCoinChipsPickerProps) {
  const styles = React.useMemo(() => makeStyles(), []);

  const height = dense ? '85%' : '95%';

  return (
    <AppListItem
      style={[styles.container]}
      containerStyle={[styles.itemContainer, { height }]}
      leftContent={
        <View style={styles.coinLogo}>
          <AppBrandLogo widthPercentage={0.05} />
        </View>
      }>
      <AppTextBody4 style={styles.coinLabel}>{getCoinName()}</AppTextBody4>
    </AppListItem>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    container: {
      width: wp('23%'),
    },
    itemContainer: {
      marginHorizontal: 0,
      marginVertical: 0,
      marginRight: 2,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      borderLeftWidth: 0,
      justifyContent: 'center',
    },
    coinLogo: {
      marginLeft: -3,
      marginRight: -5,
      alignSelf: 'center',
    },
    coinLabel: {
      width: wp('15%'),
      textAlign: 'center',
      paddingTop: 1,
    },
  });

const AppCoinChipsPicker = React.memo(Component);
export default AppCoinChipsPicker;
