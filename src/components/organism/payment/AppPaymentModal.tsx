import { Platform, View, StyleSheet } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Color from 'color';
import { useDispatch, useSelector } from 'react-redux';

import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTextHeading2 from 'enevti-app/components/atoms/text/AppTextHeading2';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import { Divider, Portal, Snackbar, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppIconGradient from 'enevti-app/components/molecules/AppIconGradient';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { reducePayment } from 'enevti-app/store/middleware/thunk/payment/reducer';
import {
  resetPaymentState,
  selectPaymentAction,
  selectPaymentFee,
  selectPaymentMode,
  selectPaymentShowState,
  selectPaymentStatus,
  setPaymentActionType,
  setPaymentStatusInReducer,
  isPaymentUndefined,
  selectPaymentFeePriority,
  setPaymentAction,
  resetPaymentStatusType,
  hidePayment,
} from 'enevti-app/store/slices/payment';
import { selectMyProfileCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import AppPaymentItem from './AppPaymentItem';
import { parseAmount } from 'enevti-app/utils/format/amount';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppPaymentGasFeePicker from './AppPaymentGasFeePicker';
import { attachFee } from 'enevti-app/service/enevti/transaction';

export default function AppPaymentModal() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const paymentSnapPoints = React.useMemo(() => ['70%'], []);
  const defaultCoin = React.useMemo(() => COIN_NAME, []);
  const cancelRef = React.useRef<boolean>(false);
  const [gasFeePickerDialogShow, setGasFeePickerDialogShow] = React.useState<boolean>(false);

  const myProfile = useSelector(selectMyProfileCache);
  const paymentShowState = useSelector(selectPaymentShowState);
  const paymentMode = useSelector(selectPaymentMode);
  const paymentStatus = useSelector(selectPaymentStatus);
  const paymentAction = useSelector(selectPaymentAction);
  const paymentFee = useSelector(selectPaymentFee);
  const paymentPriority = useSelector(selectPaymentFeePriority);
  const paymentUndefined = useSelector(isPaymentUndefined);

  const paymentTotalAmountCurrency = defaultCoin;
  const paymentTotalAmount = React.useMemo(
    () => BigInt(paymentAction.amount) + BigInt(paymentFee.gas) + BigInt(paymentFee.platform),
    [paymentAction.amount, paymentFee.gas, paymentFee.platform],
  );
  const balanceEnough = React.useMemo(
    () => BigInt(myProfile.balance) > paymentTotalAmount,
    [myProfile, paymentTotalAmount],
  );

  const onGasPriorityPress = React.useCallback(() => {
    setGasFeePickerDialogShow(old => !old);
  }, []);

  const onGasPriorityDismiss = React.useCallback(() => {
    setGasFeePickerDialogShow(false);
  }, []);

  const gasPriorityButton = React.useMemo(
    () => (
      <View style={styles.gasPickerButtonContainer}>
        <AppQuaternaryButton box onPress={onGasPriorityPress} style={styles.gasPickerButton}>
          <View style={styles.gasPickerButtonDropdown}>
            <AppTextBody5>
              {paymentPriority === 'low'
                ? t('payment:gasFeePriorityLow')
                : paymentPriority === 'normal'
                ? t('payment:gasFeePriorityNormal')
                : paymentPriority === 'high'
                ? t('payment:gasFeePriorityHigh')
                : t('payment:gasFeePriorityCustom')}
            </AppTextBody5>
            <AppIconComponent name={iconMap.dropDown} size={15} color={theme.colors.text} />
          </View>
        </AppQuaternaryButton>
      </View>
    ),
    [
      styles.gasPickerButtonDropdown,
      theme.colors.text,
      onGasPriorityPress,
      styles.gasPickerButton,
      styles.gasPickerButtonContainer,
      paymentPriority,
      t,
    ],
  );

  const paymentDismiss = React.useCallback(() => {
    if (!gasFeePickerDialogShow) {
      dispatch(hidePayment());
      dispatch(resetPaymentState());
      dispatch(resetPaymentStatusType());
      cancelRef.current = false;
    }
  }, [dispatch, gasFeePickerDialogShow]);

  const payCallback = React.useCallback(() => {
    dispatch(
      setPaymentAction({
        ...paymentAction,
        payload: JSON.stringify(
          attachFee(JSON.parse(paymentAction.payload), (BigInt(paymentFee.gas) + BigInt(paymentFee.base)).toString()),
        ),
      }),
    );
    dispatch(reducePayment());
  }, [dispatch, paymentAction, paymentFee.gas, paymentFee.base]);

  const onSnackDismiss = React.useCallback(() => {
    !cancelRef.current ? payCallback() : {};
    paymentDismiss();
  }, [payCallback, paymentDismiss]);

  const onCancel = React.useCallback(() => {
    cancelRef.current = true;
    dispatch(setPaymentActionType('cancel'));
    dispatch(
      setPaymentStatusInReducer({
        type: 'cancel',
        action: 'cancel',
        message: t('payment:paymentCancelled'),
      }),
    );
    dispatch(reducePayment());
  }, [dispatch, t]);

  const snackAction = React.useMemo(() => {
    return { label: t('payment:cancel'), onPress: onCancel };
  }, [onCancel, t]);

  const silentPay = React.useCallback(() => {
    payCallback();
    paymentDismiss();
  }, [payCallback, paymentDismiss]);

  React.useEffect(() => {
    if (paymentMode === 'silent') {
      silentPay();
    }
  }, [paymentMode, silentPay]);

  return paymentMode === 'full' ? (
    <AppMenuContainer
      enablePanDownToClose
      snapPoints={paymentSnapPoints}
      visible={paymentShowState}
      onDismiss={paymentDismiss}>
      {!paymentUndefined ? (
        <View style={styles.paymentContainer}>
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
            <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
              {paymentAction.description}
            </AppTextBody4>
          </AppListItem>

          <View style={styles.dividerView} />

          <View style={styles.transactionItem}>
            <AppTextHeading2 style={styles.transactionDetailsHeading}>
              {t('payment:transactionDetails')}
            </AppTextHeading2>
            <AppPaymentItem
              title={paymentAction.name}
              description={paymentAction.details ? paymentAction.details : paymentAction.description}
              amount={paymentAction.amount}
              currency={paymentAction.currency}
            />
            <AppPaymentItem
              title={t('payment:platformFee')}
              description={paymentFee.platform.toString() === '0' ? t('payment:platformFeeDescription') : undefined}
              amount={paymentFee.platform}
              currency={defaultCoin}
            />
            <AppPaymentItem
              title={t('payment:gasFee')}
              description={t('payment:gasFeeDescription')}
              amount={paymentFee.gas}
              currency={defaultCoin}
              trailingComponent={gasPriorityButton}
            />
            <Divider style={styles.bottomDivider} />
            <AppPaymentItem
              bold
              hideTooltip
              title={t('payment:total')}
              amount={paymentTotalAmount.toString()}
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
              disabled={!balanceEnough}
              loading={paymentStatus.type === 'process'}
              onPress={payCallback}>
              {balanceEnough ? t('payment:pay') : t('payment:notEnoughBalance')}
            </AppPrimaryButton>
          </View>

          {gasFeePickerDialogShow ? (
            <AppPaymentGasFeePicker visible={true} onDismiss={onGasPriorityDismiss} onSave={onGasPriorityDismiss} />
          ) : null}
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <AppActivityIndicator animating />
        </View>
      )}
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
  ) : paymentMode === 'silent' ? null : null;
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flex: 1,
    },
    paymentContainer: {
      flex: 1,
    },
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
      height: hp('1%', insets),
    },
    gasPickerButtonContainer: {
      marginHorizontal: wp(1),
      height: hp(3),
    },
    gasPickerButton: {
      height: '100%',
    },
    gasPickerButtonDropdown: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
    divider: {
      height: 20,
      backgroundColor: Color(theme.colors.placeholder).alpha(0.05).rgb().toString(),
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
