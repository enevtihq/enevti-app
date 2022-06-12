import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { useSelector } from 'react-redux';
import { selectPaymentFee } from 'enevti-app/store/slices/payment';
import { parseAmount } from 'enevti-app/utils/format/amount';
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

interface AppPaymentGasFeePickerProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function AppPaymentGasFeePicker({ visible, onDismiss }: AppPaymentGasFeePickerProps) {
  const insets = useSafeAreaInsets();
  const paperTheme = useTheme();
  const theme = paperTheme as Theme;
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const paymentFee = useSelector(selectPaymentFee);

  const [fee, setFee] = React.useState<string>(() => paymentFee.gas);
  const [advancedSettingCollapsed, setAdvancedSettingCollapsed] = React.useState<boolean>(false);

  const paymentSnapPoints = React.useMemo(
    () => (advancedSettingCollapsed ? ['65%'] : ['55%']),
    [advancedSettingCollapsed],
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

  const accordionOnPress = React.useCallback(() => setAdvancedSettingCollapsed(old => !old), []);

  const AdvancedSetting = React.useMemo(() => accordionHeader(iconMap.identity, 'Advanced Setting'), [accordionHeader]);

  return (
    <AppMenuContainer enablePanDownToClose visible={visible} snapPoints={paymentSnapPoints} onDismiss={onDismiss}>
      <View style={{ flex: 1 }}>
        <AppListItem
          leftContent={
            <AppIconGradient
              name={iconMap.accountCircle}
              size={wp('12%', insets)}
              androidRenderingMode={'software'}
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.headerIcon}
            />
          }>
          <AppTextHeading3 numberOfLines={1} style={styles.headerTitle}>
            Edit Fee
          </AppTextHeading3>
          <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
            Adjust fee based on your priority!
          </AppTextBody4>
        </AppListItem>

        <View style={styles.container}>
          <View style={styles.feeAmount}>
            <AppTextBodyCustom size={10} style={{ textAlign: 'center' }}>
              {parseAmount(fee.toString())}
            </AppTextBodyCustom>
            <AppTextBody4 style={{ marginLeft: wp(3, insets), alignSelf: 'center' }}>{getCoinName()}</AppTextBody4>
          </View>

          <View style={styles.priorityButtonContainer}>
            <AppSecondaryButton
              style={{ height: hp(5, insets), width: wp(25, insets), marginHorizontal: wp(1, insets) }}>
              Low
            </AppSecondaryButton>
            <AppQuaternaryButton
              style={{ height: hp(5, insets), width: wp(25, insets), marginHorizontal: wp(1, insets) }}>
              <AppTextBody3>Normal</AppTextBody3>
            </AppQuaternaryButton>
            <AppQuaternaryButton
              style={{ height: hp(5, insets), width: wp(25, insets), marginHorizontal: wp(1, insets) }}>
              <AppTextBody3>High</AppTextBody3>
            </AppQuaternaryButton>
          </View>
        </View>

        <AppAccordion expanded={advancedSettingCollapsed} title={AdvancedSetting} onPress={accordionOnPress}>
          <AppMenuFormTextInputWithError
            dense={true}
            theme={paperTheme}
            style={styles.formInput}
            returnKeyType={'go'}
            autoComplete={'off'}
            autoCorrect={false}
            label={'Custom Fee'}
            placeholder={'Min fee is: 0.0025'}
          />
        </AppAccordion>
      </View>

      <View style={styles.saveButton}>
        <AppPrimaryButton>Save</AppPrimaryButton>
      </View>
    </AppMenuContainer>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      padding: wp('5%', insets),
    },
    saveButton: {
      paddingHorizontal: wp('5%', insets),
      marginTop: hp('2%', insets),
      marginBottom: Platform.OS === 'ios' ? insets.bottom : hp('2%', insets),
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
      marginBottom: hp('2%', insets),
    },
    feeAmount: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: hp('3%', insets),
    },
    gasPickerButtonDropdown: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
  });
