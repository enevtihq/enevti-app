import { View, StyleSheet } from 'react-native';
import React from 'react';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { Theme } from 'enevti-app/theme/default';
import { RouteProp, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useSelector } from 'react-redux';
import { RootState } from 'enevti-app/store/state';
import { selectWalletView } from 'enevti-app/store/slices/ui/view/wallet';
import AppBrandLogo from 'enevti-app/components/atoms/brand/AppBrandLogo';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { getCoinName } from 'enevti-app/utils/constant/identifier';
import AppTextBody2 from 'enevti-app/components/atoms/text/AppTextBody2';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import { useTranslation } from 'react-i18next';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { commifyAmount } from 'enevti-app/utils/primitive/string';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { routeParamToAddress } from 'enevti-app/service/enevti/persona';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

interface AppWalletHeaderProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Wallet'>;
}

export const WALLET_HEADER_HEIGHT_PERCENTAGE = 41;

export default function AppWalletHeader({ navigation, route }: AppWalletHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [insets, theme]);
  const [address, setAddress] = React.useState<string>('');

  const myPersona = useSelector(selectMyPersonaCache);
  const wallet = useSelector((state: RootState) => selectWalletView(state, route.key));

  React.useEffect(() => {
    const run = async () => {
      const parsedAddress = await routeParamToAddress(route.params);
      setAddress(parsedAddress);
    };
    run();
  }, [route.params]);

  const onSend = React.useCallback(() => {
    navigation.push('SendToken', {});
  }, [navigation]);

  const onReceive = React.useCallback(() => {
    navigation.push('ReceiveToken');
  }, [navigation]);

  const onTopUp = React.useCallback(() => {}, []);

  const onSendHere = React.useCallback(() => {}, []);

  return (
    <View style={styles.walletHeaderContainer}>
      <AppBrandLogo mode={'glow'} heightPercentage={0.1} style={styles.headerImage} />

      <AppTextBody2 numberOfLines={1} style={styles.amountHeader}>
        {commifyAmount(parseAmount(wallet.balance))} {getCoinName()}
      </AppTextBody2>

      <AppQuaternaryButton
        box
        iconRight={iconMap.arrowRight}
        style={styles.stakedButton}
        contentStyle={styles.stakedButtonContent}>
        <AppTextBody4>{`${t('wallet:staked', {
          amount: commifyAmount(parseAmount(wallet.staked)),
          currency: getCoinName(),
        })}`}</AppTextBody4>
      </AppQuaternaryButton>

      <View style={styles.separator} />

      {address ? (
        myPersona.address === address ? (
          <View style={styles.walletActionContainer}>
            <View style={styles.walletActionItem}>
              <AppQuaternaryButton onPress={onSend}>
                <AppIconComponent
                  name={iconMap.transfer}
                  color={theme.colors.text}
                  size={25}
                  style={styles.walletActionIcon}
                />
                <AppTextBody4 numberOfLines={1} style={styles.walletActionLabel}>
                  {t('wallet:send')}
                </AppTextBody4>
              </AppQuaternaryButton>
            </View>
            <View style={styles.walletActionItem}>
              <AppQuaternaryButton onPress={onReceive}>
                <AppIconComponent
                  name={iconMap.receive}
                  color={theme.colors.text}
                  size={25}
                  style={styles.walletActionIcon}
                />
                <AppTextBody4 numberOfLines={1} style={styles.walletActionLabel}>
                  {t('wallet:receive')}
                </AppTextBody4>
              </AppQuaternaryButton>
            </View>
            <View style={styles.walletActionItem}>
              <AppQuaternaryButton onPress={onTopUp}>
                <AppIconComponent
                  name={iconMap.topUp}
                  color={theme.colors.text}
                  size={25}
                  style={styles.walletActionIcon}
                />
                <AppTextBody4 numberOfLines={1} style={styles.walletActionLabel}>
                  {t('wallet:topUp')}
                </AppTextBody4>
              </AppQuaternaryButton>
            </View>
          </View>
        ) : (
          <View style={styles.walletActionContainer}>
            <View style={styles.walletActionItemGuest}>
              <AppQuaternaryButton onPress={onSendHere}>
                <AppIconComponent
                  name={iconMap.sendHere}
                  color={theme.colors.text}
                  size={25}
                  style={styles.walletActionIcon}
                />
                <AppTextBody4 numberOfLines={1} style={styles.walletActionLabelGuest}>
                  {t('wallet:sendHere')}
                </AppTextBody4>
              </AppQuaternaryButton>
            </View>
          </View>
        )
      ) : (
        <View style={[styles.walletActionContainer, styles.walletActionLoader]}>
          <AppActivityIndicator animating />
        </View>
      )}
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    walletHeaderContainer: {
      alignItems: 'center',
      paddingVertical: hp('1%', insets),
      height: hp(WALLET_HEADER_HEIGHT_PERCENTAGE, insets),
      width: wp('100%', insets),
      backgroundColor: theme.colors.background,
    },
    separator: {
      marginBottom: hp('3%', insets),
    },
    amountHeader: {
      marginBottom: hp('2%', insets),
    },
    headerImage: {
      alignSelf: 'center',
      marginBottom: hp('2%', insets),
    },
    stakedButton: {
      height: hp('5%', insets),
      borderRadius: theme.roundness * 2,
    },
    stakedButtonContent: {
      paddingHorizontal: wp('5%', insets),
    },
    walletActionContainer: {
      flexDirection: 'row',
      height: hp('8%', insets),
    },
    walletActionLoader: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    walletActionItem: {
      marginHorizontal: wp('2%', insets),
      width: wp('18%', insets),
    },
    walletActionItemGuest: {
      marginHorizontal: wp('2%', insets),
      width: wp('25%', insets),
    },
    walletActionIcon: {
      alignItems: 'center',
      alignSelf: 'center',
    },
    walletActionLabel: {
      textAlign: 'center',
      width: wp('18%', insets),
      marginTop: hp('1%', insets),
    },
    walletActionLabelGuest: {
      textAlign: 'center',
      width: wp('25%', insets),
      marginTop: hp('1%', insets),
    },
  });
