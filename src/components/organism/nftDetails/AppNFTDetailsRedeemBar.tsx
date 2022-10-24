import { View, StyleSheet } from 'react-native';
import React from 'react';
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
import AppTextHeadingCustom from 'enevti-app/components/atoms/text/AppTextHeadingCustom';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useDispatch } from 'react-redux';
import { reduceRedeem } from 'enevti-app/store/middleware/thunk/redeem';
import { addRedeemCalendarEvent } from 'enevti-app/utils/date/calendar';
import { useTranslation } from 'react-i18next';
import utilityToLabel from 'enevti-app/utils/format/utilityToLabel';
import nftToRedeemScheduleLabel from 'enevti-app/utils/date/nftToRedeemScheduleLabel';
import { getMyAddress } from 'enevti-app/service/enevti/persona';
import { isRedeemTimeUTC } from 'enevti-app/utils/date/redeemDate';
import AppPoppableIcon from 'enevti-app/components/molecules/menu/AppPoppableIcon';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';

interface AppNFTDetailsRedeemBarProps {
  nft: NFT;
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'NFTDetails'>;
}

export default function AppNFTDetailsRedeemBar({ nft, navigation, route }: AppNFTDetailsRedeemBarProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  const canAddCalendar = React.useMemo(
    () =>
      nft.utility !== 'content' &&
      nft.redeem.status !== 'limit-exceeded' &&
      nft.redeem.schedule.recurring !== 'anytime',
    [nft],
  );

  const [redeemError, setRedeemError] = React.useState<string>();
  const [redeemButtonDisabled, setRedeemButtonDisabled] = React.useState<boolean>(false);

  const onRedeem = React.useCallback(() => {
    dispatch(reduceRedeem(nft, navigation, route));
  }, [dispatch, nft, navigation, route]);

  const onAddEvent = React.useCallback(async () => {
    await addRedeemCalendarEvent(nft);
  }, [nft]);

  const onLoaded = React.useCallback(async () => {
    const addr = await getMyAddress();
    const isTime = isRedeemTimeUTC(nft);

    let error: string = t('nftDetails:redeemError');
    let errorCount: number = 1;

    const isExceeded = nft.redeem.status === 'limit-exceeded';
    const isNotOwner =
      nft.utility === 'videocall'
        ? ![nft.owner.address, nft.creator.address].includes(addr)
        : nft.owner.address !== addr;
    const isPending = nft.redeem.status === 'pending-secret';
    const isNotTime = !isTime;

    isExceeded ? (error += `\n${errorCount++}. ${t('error:redeemExceeded')}`) : {};
    isNotOwner ? (error += `\n${errorCount++}. ${t('error:notTheOwner')}`) : {};
    isPending ? (error += `\n${errorCount++}. ${t('error:isPending')}`) : {};
    isNotTime ? (error += `\n${errorCount++}. ${t('error:notTheTime')}`) : {};

    setRedeemButtonDisabled(isExceeded || isNotOwner || isPending || isNotTime);
    setRedeemError(error);

    if (route.params.redeem === 'true') {
      if (isExceeded || isNotOwner || isPending || isNotTime) {
        dispatch(showSnackbar({ mode: 'info', text: t('nftDetails:redeemFailed') }));
      } else {
        onRedeem();
      }
    }
  }, [dispatch, nft, onRedeem, route.params.redeem, t]);

  React.useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  const RedeemScheduleView = canAddCalendar ? TouchableRipple : View;

  return (
    <View style={styles.redeemContainer}>
      <View style={styles.redeemRow}>
        <AppIconGradient
          name={utilityToIcon(nft.utility)}
          size={25}
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.redeemRowIcon}
        />
        <View style={styles.redeemBarUtilityContainer}>
          <AppTextBody5 style={styles.redeemBarUtilityText}>{t('createNFT:nftUtility')}</AppTextBody5>
          <AppTextHeading3>{utilityToLabel(nft.utility)}</AppTextHeading3>
        </View>
        <AppPrimaryButton disabled={redeemButtonDisabled} style={styles.redeemBarButton} onPress={onRedeem}>
          <AppTextHeadingCustom size={3} style={styles.redeemBarButtonText}>
            {t('nftDetails:redeem')}
          </AppTextHeadingCustom>
        </AppPrimaryButton>
        {redeemButtonDisabled && redeemError ? (
          <AppPoppableIcon position={'left'} content={redeemError} width={75} iconStyle={styles.popableInfoIcon} />
        ) : null}
      </View>
      <Divider style={styles.divider} />
      <RedeemScheduleView onPress={onAddEvent} style={styles.calendarPressable}>
        <AppTextBody4 style={styles.calendarLabelText}>
          {`${nftToRedeemScheduleLabel(nft)} `}
          {canAddCalendar ? (
            <AppTextBody5 style={styles.calendarActionText}>({t('nftDetails:addToCalendar')})</AppTextBody5>
          ) : null}
        </AppTextBody4>
      </RedeemScheduleView>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    redeemContainer: {
      marginHorizontal: wp('5%', insets),
      paddingVertical: wp('2%', insets),
      paddingHorizontal: wp('3%', insets),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
      overflow: 'hidden',
    },
    redeemRow: {
      flexDirection: 'row',
    },
    redeemRowIcon: {
      alignSelf: 'center',
      marginRight: wp('3%', insets),
    },
    redeemBarUtilityContainer: {
      flex: 1,
    },
    redeemBarUtilityText: {
      lineHeight: hp('1.5%', insets),
    },
    redeemBarButton: {
      height: hp('4%', insets),
      justifyContent: 'center',
      alignSelf: 'center',
    },
    redeemBarButtonText: {
      color: 'white',
    },
    divider: {
      marginVertical: wp('2%', insets),
    },
    calendarPressable: {
      justifyContent: 'center',
    },
    calendarLabelText: {
      color: theme.colors.placeholder,
      lineHeight: hp('2.5%', insets),
    },
    calendarActionText: {
      color: theme.colors.primary,
      lineHeight: hp('2.5%', insets),
    },
    popableInfoIcon: {
      height: hp('4%', insets),
      width: wp('7%', insets),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
