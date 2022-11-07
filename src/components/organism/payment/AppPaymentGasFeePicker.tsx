import React from 'react';
import { View, StyleSheet, Platform, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPaymentFee,
  selectPaymentFeePriority,
  selectPaymentActionPayload,
  setPaymentFee,
} from 'enevti-app/store/slices/payment';
import { completeTokenUnit, parseAmount } from 'enevti-app/utils/format/amount';
import AppTextBodyCustom from 'enevti-app/components/atoms/text/AppTextBodyCustom';
import { getCoinName } from 'enevti-app/utils/constant/identifier';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppSecondaryButton from 'enevti-app/components/atoms/button/AppSecondaryButton';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppAccordion from 'enevti-app/components/atoms/accordion/AppAccordion';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppIconGradient from 'enevti-app/components/molecules/AppIconGradient';
import AppMenuFormTextInputWithError from 'enevti-app/components/molecules/menu/AppMenuFormTextInputWithError';
import { useTranslation } from 'react-i18next';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import {
  calculateGasFeeLow,
  calculateGasFee,
  calculateGasFeeHigh,
  calculateMinGasFee,
} from 'enevti-app/service/enevti/transaction';
import { AppTransaction } from 'enevti-app/types/core/service/transaction';
import { PaymentFee } from 'enevti-app/types/ui/store/Payment';

interface AppPaymentGasFeePickerProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: () => void;
}

export default function AppPaymentGasFeePicker({ visible, onDismiss, onSave }: AppPaymentGasFeePickerProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const paperTheme = useTheme();
  const theme = paperTheme as Theme;
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const paymentSnapPoints = React.useMemo(() => ['55%'], []);

  const paymentFee = useSelector(selectPaymentFee);
  const paymentPriority = useSelector(selectPaymentFeePriority);
  const paymentPayload = useSelector(selectPaymentActionPayload);

  const [fee, setFee] = React.useState<string>(() => paymentFee.gas);
  const [minFee, setMinFee] = React.useState<string>('0');

  const [customFee, setCustomFee] = React.useState<string>(() =>
    paymentPriority === 'custom' ? parseAmount(paymentFee.gas) : '',
  );
  const [customFeeTouched, setCustomFeeTouched] = React.useState<boolean>(() => paymentPriority === 'custom');
  const [customFeeChanged, setCustomFeeChanged] = React.useState<boolean>(() => paymentPriority === 'custom');
  const [customFeeError, setCustomFeeError] = React.useState<string>('');

  const [priority, setPriority] = React.useState<PaymentFee['priority']>(() => paymentPriority);
  const [feeLoading, setFeeLoading] = React.useState<boolean>(false);

  const isStartWithCustomRef = React.useRef<boolean>(paymentPriority === 'custom');
  const [advancedSettingTouched, setAdvancedSettingTouched] = React.useState<boolean>(false);
  const [advancedSettingCollapsed, setAdvancedSettingCollapsed] = React.useState<boolean>(
    () => paymentPriority === 'custom',
  );

  const saveEnabled = React.useMemo(
    () => (advancedSettingCollapsed ? customFeeChanged && !customFeeError : true),
    [advancedSettingCollapsed, customFeeChanged, customFeeError],
  );

  React.useEffect(() => {
    async function run() {
      const feeResponse = await calculateMinGasFee(JSON.parse(paymentPayload) as AppTransaction<any>);
      if (feeResponse) {
        setMinFee(feeResponse);
      }
    }
    run();
  }, [paymentPayload]);

  const onCustomFeeChange = React.useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setCustomFee(e.nativeEvent.text);
      if (!customFeeChanged) {
        setCustomFeeChanged(true);
      }
      if (parseFloat(e.nativeEvent.text) < parseFloat(parseAmount(minFee))) {
        setCustomFeeError(t('payment:minCustomFee', { fee: parseAmount(minFee), coin: getCoinName() }));
      } else {
        setCustomFeeError('');
      }
    },
    [minFee, customFeeChanged, t],
  );

  const onCustomFeeBlur = React.useCallback(_ => {
    setCustomFeeTouched(true);
  }, []);

  const onLowSelected = React.useCallback(async () => {
    setFeeLoading(true);
    const feeResponse = await calculateGasFeeLow(JSON.parse(paymentPayload) as AppTransaction<any>);
    if (feeResponse) {
      setFee(feeResponse);
      setPriority('low');
    }
    setFeeLoading(false);
  }, [paymentPayload]);

  const onNormalSelected = React.useCallback(async () => {
    setFeeLoading(true);
    const feeResponse = await calculateGasFee(JSON.parse(paymentPayload) as AppTransaction<any>);
    if (feeResponse) {
      setFee(feeResponse);
      setPriority('normal');
    }
    setFeeLoading(false);
  }, [paymentPayload]);

  const onHighSelected = React.useCallback(async () => {
    setFeeLoading(true);
    const feeResponse = await calculateGasFeeHigh(JSON.parse(paymentPayload) as AppTransaction<any>);
    if (feeResponse) {
      setFee(feeResponse);
      setPriority('high');
    }
    setFeeLoading(false);
  }, [paymentPayload]);

  const handleSave = React.useCallback(() => {
    if (advancedSettingCollapsed) {
      dispatch(setPaymentFee({ ...paymentFee, gas: completeTokenUnit(customFee), priority: 'custom' }));
    } else {
      dispatch(setPaymentFee({ ...paymentFee, gas: fee, priority }));
    }
    onSave();
  }, [advancedSettingCollapsed, customFee, fee, priority, paymentFee, dispatch, onSave]);

  const buttonSelected = React.useCallback(
    (label: string, onPress: () => void) => (
      <AppSecondaryButton onPress={onPress} style={styles.gasFeePriorityButton}>
        {label}
      </AppSecondaryButton>
    ),
    [styles.gasFeePriorityButton],
  );

  const buttonUnselected = React.useCallback(
    (label: string, onPress: () => void) => (
      <AppQuaternaryButton style={styles.gasFeePriorityButton} onPress={onPress}>
        <AppTextBody3>{label}</AppTextBody3>
      </AppQuaternaryButton>
    ),
    [styles.gasFeePriorityButton],
  );

  const accordionHeader = React.useCallback(
    (icon: string, text: string) => (
      <View style={styles.accordionListView}>
        <AppIconComponent name={icon} color={theme.colors.text} size={20} style={styles.accordionIcon} />
        <AppTextBody3>{text}</AppTextBody3>
      </View>
    ),
    [styles.accordionIcon, styles.accordionListView, theme.colors.text],
  );

  const accordionOnPress = React.useCallback(async () => {
    setAdvancedSettingCollapsed(old => !old);
    if (isStartWithCustomRef.current && !advancedSettingTouched) {
      setAdvancedSettingTouched(true);
      await onNormalSelected();
    }
  }, [advancedSettingTouched, onNormalSelected]);

  const AdvancedSetting = React.useMemo(
    () => accordionHeader(iconMap.setting, t('payment:advancedSetting')),
    [t, accordionHeader],
  );

  return (
    <AppMenuContainer
      dismissKeyboard
      enablePanDownToClose
      visible={visible}
      snapPoints={paymentSnapPoints}
      onDismiss={onDismiss}>
      <View style={styles.menuContainer}>
        <AppListItem
          leftContent={
            <AppIconGradient
              name={iconMap.calculator}
              size={wp('12%', insets)}
              androidRenderingMode={'software'}
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.headerIcon}
            />
          }>
          <AppTextHeading3 numberOfLines={1} style={styles.headerTitle}>
            {t('payment:editGasFee')}
          </AppTextHeading3>
          <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
            {t('payment:editGasFeeDescription')}
          </AppTextBody4>
        </AppListItem>

        {!advancedSettingCollapsed ? (
          <View style={styles.container}>
            {!feeLoading ? (
              <View>
                <View style={styles.feeAmount}>
                  <AppTextBodyCustom size={10} style={styles.gasFeeHeader}>
                    {parseAmount(fee.toString())}
                  </AppTextBodyCustom>
                  <AppTextBody4 style={styles.gasFeeHeaderCoin}>{getCoinName()}</AppTextBody4>
                </View>

                <View style={styles.priorityButtonContainer}>
                  {priority === 'low'
                    ? buttonSelected(t('payment:gasFeePriorityLow'), onLowSelected)
                    : buttonUnselected(t('payment:gasFeePriorityLow'), onLowSelected)}
                  {priority === 'normal'
                    ? buttonSelected(t('payment:gasFeePriorityNormal'), onNormalSelected)
                    : buttonUnselected(t('payment:gasFeePriorityNormal'), onNormalSelected)}
                  {priority === 'high'
                    ? buttonSelected(t('payment:gasFeePriorityHigh'), onHighSelected)
                    : buttonUnselected(t('payment:gasFeePriorityHigh'), onHighSelected)}
                </View>
              </View>
            ) : (
              <View style={styles.loaderContainer}>
                <AppActivityIndicator animating />
              </View>
            )}
          </View>
        ) : null}

        <AppAccordion expanded={advancedSettingCollapsed} title={AdvancedSetting} onPress={accordionOnPress}>
          <AppMenuFormTextInputWithError
            theme={paperTheme}
            style={styles.formInput}
            returnKeyType={'go'}
            keyboardType={'number-pad'}
            autoComplete={'off'}
            autoCorrect={false}
            value={customFee}
            label={t('payment:customFee')}
            placeholder={t('payment:minCustomFee', { fee: parseAmount(minFee), coin: getCoinName() })}
            onChange={onCustomFeeChange}
            error={!!customFeeError && customFeeTouched}
            errorText={customFeeError}
            showError={customFeeTouched}
            blurOnSubmit={true}
            onBlur={onCustomFeeBlur}
          />
        </AppAccordion>
      </View>

      <View style={styles.saveButton}>
        <AppPrimaryButton disabled={!saveEnabled} onPress={handleSave}>
          {t('payment:save')}
        </AppPrimaryButton>
      </View>
    </AppMenuContainer>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: hp(15, insets),
      width: '100%',
      marginBottom: hp('3%', insets),
    },
    menuContainer: {
      flex: 1,
    },
    container: {
      padding: wp('5%', insets),
    },
    gasFeeHeader: {
      textAlign: 'center',
    },
    gasFeeHeaderCoin: {
      marginLeft: wp(3, insets),
      alignSelf: 'center',
    },
    saveButton: {
      paddingHorizontal: wp('5%', insets),
      marginTop: hp('2%', insets),
      marginBottom: Platform.OS === 'ios' ? insets.bottom : hp('2%', insets),
    },
    gasFeePriorityButton: {
      height: hp(5, insets),
      width: wp(25, insets),
      marginHorizontal: wp(1, insets),
    },
    formInput: {
      marginBottom: hp('1%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    headerTitle: {
      width: wp('50%', insets),
    },
    headerIcon: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
    accordionListView: {
      flexDirection: 'row',
      marginLeft: wp('1%', insets),
    },
    accordionIcon: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
    priorityButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      height: hp(5, insets),
      marginBottom: hp('2%', insets),
    },
    feeAmount: {
      flexDirection: 'row',
      justifyContent: 'center',
      height: hp(8, insets),
      marginBottom: hp('3%', insets),
    },
    gasPickerButtonDropdown: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
  });
