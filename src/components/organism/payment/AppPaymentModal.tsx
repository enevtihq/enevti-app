import { Platform, View, StyleSheet } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Color from 'color';
import { useDispatch, useSelector } from 'react-redux';

import AppMenuContainer from '../../atoms/menu/AppMenuContainer';
import { hp, wp, SafeAreaInsets } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTextHeading2 from '../../atoms/text/AppTextHeading2';
import AppListItem from '../../molecules/list/AppListItem';
import { Divider, Portal, Snackbar, useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppIconGradient from '../../molecules/AppIconGradient';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import { COIN_NAME } from '../../atoms/brand/AppBrandConstant';
import AppPrimaryButton from '../../atoms/button/AppPrimaryButton';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import AppTextBody5 from '../../atoms/text/AppTextBody5';
import { reducePayment } from '../../../store/middleware/thunk/payment';
import {
  resetPaymentState,
  selectPaymentAction,
  selectPaymentFee,
  selectPaymentMode,
  selectPaymentShowState,
  selectPaymentStatus,
  setPaymentActionType,
  setPaymentStatus,
} from '../../../store/slices/payment';
import AppPaymentItem from './AppPaymentItem';
import { parseAmount } from '../../../utils/format/amount';

export default function AppPaymentModal() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const paymentSnapPoints = React.useMemo(() => ['70%'], []);
  const defaultCoin = React.useMemo(() => COIN_NAME, []);

  const paymentMode = useSelector(selectPaymentMode);
  const paymentStatus = useSelector(selectPaymentStatus);
  const paymentShowState = useSelector(selectPaymentShowState);
  const paymentAction = useSelector(selectPaymentAction);
  const paymentFee = useSelector(selectPaymentFee);
  const paymentTotalAmountCurrency = defaultCoin;
  const paymentTotalAmount =
    paymentAction.amount + paymentFee.gas + paymentFee.platform;

  const paymentDismiss = React.useCallback(() => {
    dispatch(resetPaymentState());
  }, [dispatch]);

  const payCallback = React.useCallback(
    () => dispatch(reducePayment()),
    [dispatch],
  );

  const onSnackDismiss = React.useCallback(() => {
    payCallback();
    paymentDismiss();
  }, [payCallback, paymentDismiss]);

  const onCancel = React.useCallback(() => {
    paymentDismiss();
    dispatch(setPaymentActionType('cancel'));
    dispatch(
      setPaymentStatus({
        type: 'cancel',
        message: t('payment:paymentCancelled'),
      }),
    );
  }, [paymentDismiss, dispatch, t]);

  const snackAction = React.useMemo(() => {
    return { label: t('payment:cancel'), onPress: onCancel };
  }, [onCancel, t]);

  const silentPay = React.useCallback(
    _ => {
      payCallback();
      paymentDismiss();
    },
    [payCallback, paymentDismiss],
  );

  return paymentMode === 'full' ? (
    <AppMenuContainer
      enablePanDownToClose
      snapPoints={paymentSnapPoints}
      visible={paymentShowState}
      onDismiss={paymentDismiss}>
      <AppListItem
        leftContent={
          <AppIconGradient
            name={paymentAction.icon}
            size={wp('12%', insets)}
            androidRenderingMode={'software'}
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.headerIcon}
          />
        }>
        <AppTextHeading3 numberOfLines={1} style={styles.headerTitle}>
          {paymentAction.name}
        </AppTextHeading3>
        <AppTextBody4
          style={{ color: theme.colors.placeholder }}
          numberOfLines={1}>
          {paymentAction.description}
        </AppTextBody4>
      </AppListItem>

      <View style={styles.dividerView} />
      <Divider style={styles.divider} />

      <View style={styles.transactionItem}>
        <AppTextHeading2 style={styles.transactionDetailsHeading}>
          {t('payment:transactionDetails')}
        </AppTextHeading2>
        <AppPaymentItem
          title={paymentAction.name}
          description={paymentAction.description}
          amount={paymentAction.amount}
          currency={paymentAction.currency}
        />
        <AppPaymentItem
          title={t('payment:platformFee')}
          description={
            paymentFee.platform === BigInt(0)
              ? t('payment:platformFeeDescription')
              : undefined
          }
          amount={paymentFee.platform}
          currency={defaultCoin}
        />
        <AppPaymentItem
          title={t('payment:gasFee')}
          description={t('payment:gasFeeDescription')}
          amount={paymentFee.gas}
          currency={defaultCoin}
        />
        <Divider style={styles.bottomDivider} />
        <AppPaymentItem
          bold
          hideTooltip
          title={t('payment:total')}
          amount={paymentTotalAmount}
          currency={paymentTotalAmountCurrency}
        />
      </View>

      <AppListItem
        containerStyle={styles.secureNoteView}
        leftContent={
          <AppIconGradient
            name={iconMap.shield}
            size={wp('5%', insets)}
            androidRenderingMode={'software'}
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.secureNoteIcon}
          />
        }>
        <AppTextBody5 style={styles.secureNoteText} numberOfLines={2}>
          {t('payment:secureNote')}
        </AppTextBody5>
      </AppListItem>

      <Divider />

      <View style={styles.payButton}>
        <AppPrimaryButton
          loading={paymentStatus.type === 'process'}
          onPress={payCallback}>
          {t('payment:pay')}
        </AppPrimaryButton>
      </View>
    </AppMenuContainer>
  ) : paymentMode === 'compact' ? (
    <Portal>
      <Snackbar
        duration={3000}
        visible={paymentShowState}
        onDismiss={onSnackDismiss}
        style={styles.snackPay}
        theme={{ colors: { accent: theme.colors.primary } }}
        action={snackAction}>
        {t('payment:snackPay', {
          action: paymentAction.name,
          amount: parseAmount(paymentTotalAmount.toString()),
          currency: paymentTotalAmountCurrency,
        })}
      </Snackbar>
    </Portal>
  ) : paymentMode === 'silent' ? (
    <View onLayout={silentPay} />
  ) : null;
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    payButton: {
      paddingHorizontal: wp('5%', insets),
      marginTop: hp('2%', insets),
      marginBottom: Platform.OS === 'ios' ? insets.bottom : hp('2%', insets),
    },
    headerIcon: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
    headerTitle: {
      width: wp('50%', insets),
    },
    dividerView: {
      height: hp('2%', insets),
    },
    divider: {
      height: 20,
      backgroundColor: Color(theme.colors.placeholder)
        .alpha(0.05)
        .rgb()
        .toString(),
    },
    bottomDivider: {
      marginBottom: hp('1%', insets),
    },
    transactionItem: {
      flex: 1,
      paddingHorizontal: wp('5%', insets),
    },
    transactionDetailsHeading: {
      marginBottom: hp('3%', insets),
      marginTop: hp('2%', insets),
    },
    secureNoteView: {
      marginVertical: hp('2%', insets),
    },
    secureNoteIcon: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
    secureNoteText: {
      color: theme.colors.placeholder,
    },
    snackPay: {
      marginVertical: hp('10%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
