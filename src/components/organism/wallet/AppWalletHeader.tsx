import { View, StyleSheet } from 'react-native';
import React from 'react';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { Theme } from 'enevti-app/theme/default';
import { RouteProp, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppTextHeading1 from 'enevti-app/components/atoms/text/AppTextHeading1';
import { useSelector } from 'react-redux';
import { RootState } from 'enevti-app/store/state';
import { selectWalletView } from 'enevti-app/store/slices/ui/view/wallet';
import AppBrandLogo from 'enevti-app/components/atoms/brand/AppBrandLogo';
import AppTextBody1 from 'enevti-app/components/atoms/text/AppTextBody1';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { getCoinName } from 'enevti-app/utils/constant/identifier';
import AppTextBody2 from 'enevti-app/components/atoms/text/AppTextBody2';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import { useTranslation } from 'react-i18next';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import Color from 'color';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';

interface AppWalletHeaderProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Wallet'>;
}

export const PROFILE_HEADER_HEIGHT_PERCENTAGE = 40;

export default function AppWalletHeader({ navigation, route }: AppWalletHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [insets, theme]);

  const wallet = useSelector((state: RootState) => selectWalletView(state, route.key));
  const staked = React.useMemo(
    () =>
      wallet.staked.reduce((prev, current) => {
        return (BigInt(prev) + BigInt(current.amount)).toString();
      }, '0'),
    [wallet.staked],
  );

  return (
    <View style={styles.walletHeaderContainer}>
      <AppBrandLogo mode={'glow'} heightPercentage={0.1} style={styles.headerImage} />

      <AppTextBody2 numberOfLines={1} style={styles.amountHeader}>
        {parseAmount(wallet.balance)} {getCoinName()}
      </AppTextBody2>

      <AppQuaternaryButton
        iconRight={iconMap.arrowRight}
        style={{
          height: hp('5%', insets),
          backgroundColor: theme.dark
            ? Color(theme.colors.background).lighten(0.6).rgb().toString()
            : Color(theme.colors.background).darken(0.12).rgb().toString(),
          borderRadius: theme.roundness * 2,
        }}
        contentStyle={{ paddingHorizontal: wp('5%', insets) }}>
        <AppTextBody4>{`${t('wallet:staked', { amount: parseAmount(staked), currency: getCoinName() })}`}</AppTextBody4>
      </AppQuaternaryButton>

      <View style={{ marginBottom: hp('3%', insets) }} />

      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginHorizontal: wp('2%', insets), width: wp('18%', insets) }}>
          <AppQuaternaryButton style={{ height: hp('8%', insets) }} onPress={() => {}}>
            <AppIconComponent
              name={iconMap.add}
              color={theme.colors.text}
              size={25}
              style={{
                alignItems: 'center',
                alignSelf: 'center',
              }}
            />
            <AppTextBody4 style={{ textAlign: 'center', marginTop: hp('1%', insets) }}>Top-Up</AppTextBody4>
          </AppQuaternaryButton>
        </View>
        <View style={{ marginHorizontal: wp('2%', insets), width: wp('18%', insets) }}>
          <AppQuaternaryButton style={{ height: hp('8%', insets) }} onPress={() => {}}>
            <AppIconComponent
              name={iconMap.add}
              color={theme.colors.text}
              size={25}
              style={{
                alignItems: 'center',
                alignSelf: 'center',
              }}
            />
            <AppTextBody4 style={{ textAlign: 'center', marginTop: hp('1%', insets) }}>Top-Up</AppTextBody4>
          </AppQuaternaryButton>
        </View>
        <View style={{ marginHorizontal: wp('2%', insets), width: wp('18%', insets) }}>
          <AppQuaternaryButton style={{ height: hp('8%', insets) }} onPress={() => {}}>
            <AppIconComponent
              name={iconMap.add}
              color={theme.colors.text}
              size={25}
              style={{
                alignItems: 'center',
                alignSelf: 'center',
              }}
            />
            <AppTextBody4 style={{ textAlign: 'center', marginTop: hp('1%', insets) }}>Top-Up</AppTextBody4>
          </AppQuaternaryButton>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    walletHeaderContainer: {
      alignItems: 'center',
      paddingVertical: hp('1%', insets),
      height: hp(PROFILE_HEADER_HEIGHT_PERCENTAGE, insets),
      width: wp('100%', insets),
      backgroundColor: theme.colors.background,
    },
    amountHeader: {
      marginBottom: hp('2%', insets),
    },
    headerImage: {
      alignSelf: 'center',
      marginBottom: hp('2%', insets),
    },
  });
