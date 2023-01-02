import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Theme } from 'enevti-app/theme/default';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import Color from 'color';
import { Divider, TouchableRipple, useTheme } from 'react-native-paper';
import AppIconGradient from 'enevti-app/components/molecules/icon/AppIconGradient';
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
import i18n from 'enevti-app/translations/i18n';
import useDebouncedNavigation from 'enevti-app/utils/hook/useDebouncedNavigation';

interface AppNFTDetailsRedeemBarProps {
  nft: NFT;
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'NFTDetails'>;
}

export async function getRedeemErrors(nft: NFT): Promise<[boolean, string]> {
  const addr = await getMyAddress();
  const isTime = isRedeemTimeUTC(nft);

  let error: string = i18n.t('nftDetails:redeemError');
  let errorCount: number = 1;

  const isExceeded = nft.redeem.status === 'limit-exceeded';
  const isNotOwner =
    nft.utility === 'videocall' ? ![nft.owner.address, nft.creator.address].includes(addr) : nft.owner.address !== addr;
  const isPending = nft.redeem.status === 'pending-secret';
  const isNotTime = !isTime;

  isExceeded ? (error += `\n${errorCount++}. ${i18n.t('error:redeemExceeded')}`) : {};
  isNotOwner ? (error += `\n${errorCount++}. ${i18n.t('error:notTheOwner')}`) : {};
  isPending ? (error += `\n${errorCount++}. ${i18n.t('error:isPending')}`) : {};
  isNotTime ? (error += `\n${errorCount++}. ${i18n.t('error:notTheTime')}`) : {};

  return [isExceeded || isNotOwner || isPending || isNotTime, error];
}

export default function AppNFTDetailsRedeemBar({ nft, navigation, route }: AppNFTDetailsRedeemBarProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const dnavigation = useDebouncedNavigation(navigation);
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

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
    dispatch(reduceRedeem(nft, dnavigation, route));
  }, [dispatch, nft, dnavigation, route]);

  const onAddEvent = React.useCallback(async () => {
    await addRedeemCalendarEvent(nft);
  }, [nft]);

  const onLoaded = React.useCallback(async () => {
    const [redeemNotAvailable, redeemErrors] = await getRedeemErrors(nft);
    setRedeemButtonDisabled(redeemNotAvailable);
    setRedeemError(redeemErrors);
  }, [nft]);

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

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    redeemContainer: {
      marginHorizontal: wp('5%'),
      paddingVertical: wp('2%'),
      paddingHorizontal: wp('3%'),
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
      marginRight: wp('3%'),
    },
    redeemBarUtilityContainer: {
      flex: 1,
    },
    redeemBarUtilityText: {
      lineHeight: hp('1.5%'),
    },
    redeemBarButton: {
      height: hp('4%'),
      justifyContent: 'center',
      alignSelf: 'center',
    },
    redeemBarButtonText: {
      color: 'white',
    },
    divider: {
      marginVertical: wp('2%'),
    },
    calendarPressable: {
      justifyContent: 'center',
    },
    calendarLabelText: {
      color: theme.colors.placeholder,
      lineHeight: hp('2.5%'),
    },
    calendarActionText: {
      color: theme.colors.primary,
      lineHeight: hp('2.5%'),
    },
    popableInfoIcon: {
      height: hp('4%'),
      width: wp('7%'),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
