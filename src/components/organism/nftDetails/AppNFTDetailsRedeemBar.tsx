import { View, StyleSheet } from 'react-native';
import React from 'react';
import { NFT } from 'enevti-app/types/nft';
import { Theme } from 'enevti-app/theme/default';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import Color from 'color';
import { Divider, TouchableRipple, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIconGradient from 'enevti-app/components/molecules/AppIconGradient';
import utilityToIcon from 'enevti-app/utils/icon/utilityToIcon';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';

interface AppNFTDetailsRedeemBarProps {
  nft: NFT;
}

export default function AppNFTDetailsRedeemBar({
  nft,
}: AppNFTDetailsRedeemBarProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );

  return (
    <View style={styles.listContainer}>
      <View style={{ flexDirection: 'row' }}>
        <AppIconGradient
          name={utilityToIcon(nft.utility)}
          size={25}
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={{ alignSelf: 'center', marginRight: wp('3%', insets) }}
        />
        <View style={{ flex: 1 }}>
          <AppTextBody5 style={{ lineHeight: hp('1.5%', insets) }}>
            Utility
          </AppTextBody5>
          <AppTextHeading3>Video Call</AppTextHeading3>
        </View>
        <AppPrimaryButton
          style={{
            height: hp('4%', insets),
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <AppTextHeading4 style={{ color: 'white' }}>Redeem</AppTextHeading4>
        </AppPrimaryButton>
      </View>
      <Divider style={{ marginVertical: wp('2%', insets) }} />
      <View style={{ height: hp('5%', insets) }}>
        <TouchableRipple onPress={() => {}}>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>
            Every Month · September, 12 · 10:00 - 12:00 AM GMT+12 · 5 Redeem
            Remaining{' '}
            <AppTextBody5 style={{ color: theme.colors.primary }}>
              (Add To Calendar)
            </AppTextBody5>
          </AppTextBody4>
        </TouchableRipple>
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    listContainer: {
      marginHorizontal: wp('5%', insets),
      paddingVertical: wp('2%', insets),
      paddingHorizontal: wp('3%', insets),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
      overflow: 'hidden',
    },
  });
