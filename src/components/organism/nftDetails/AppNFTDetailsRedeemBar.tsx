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
import { useDispatch } from 'react-redux';
import { reduceRedeem } from 'enevti-app/store/middleware/thunk/redeem';
import { addRedeemCalendarEvent } from 'enevti-app/utils/date/calendar';
import { useTranslation } from 'react-i18next';
import utilityToLabel from 'enevti-app/utils/format/utilityToLabel';
import nftToRedeemScheduleLabel from 'enevti-app/utils/date/nftToRedeemScheduleLabel';

interface AppNFTDetailsRedeemBarProps {
  nft: NFT;
}

export default function AppNFTDetailsRedeemBar({
  nft,
}: AppNFTDetailsRedeemBarProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );

  const onRedeem = React.useCallback(() => {
    dispatch(reduceRedeem(nft));
  }, [dispatch, nft]);

  const onAddEvent = React.useCallback(async () => {
    await addRedeemCalendarEvent(nft);
  }, [nft]);

  const RedeemScheduleView = nft.utility !== 'content' ? TouchableRipple : View;

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
          <AppTextBody5 style={styles.redeemBarUtilityText}>
            {t('createNFT:nftUtility')}
          </AppTextBody5>
          <AppTextHeading3>{utilityToLabel(nft.utility)}</AppTextHeading3>
        </View>
        <AppPrimaryButton style={styles.redeemBarButton} onPress={onRedeem}>
          <AppTextHeading4 style={styles.redeemBarButtonText}>
            {t('nftDetails:redeem')}
          </AppTextHeading4>
        </AppPrimaryButton>
      </View>
      <Divider style={styles.divider} />
      <RedeemScheduleView onPress={onAddEvent} style={styles.calendarPressable}>
        <AppTextBody4 style={styles.calendarLabelText}>
          {`${nftToRedeemScheduleLabel(nft)} `}
          {nft.utility !== 'content' ? (
            <AppTextBody5 style={styles.calendarActionText}>
              ({t('nftDetails:addToCalendar')})
            </AppTextBody5>
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
  });
