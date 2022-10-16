import { NativeSyntheticEvent, Platform, StyleSheet, TextInputChangeEventData, View } from 'react-native';
import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppTextHeading1 from 'enevti-app/components/atoms/text/AppTextHeading1';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import Color from 'color';
import { completeTokenUnit, parseAmount } from 'enevti-app/utils/format/amount';
import { getCoinName } from 'enevti-app/utils/constant/identifier';
import AppAccordion from 'enevti-app/components/atoms/accordion/AppAccordion';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import AppMenuFormTextInputWithError from 'enevti-app/components/molecules/menu/AppMenuFormTextInputWithError';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import { useTranslation } from 'react-i18next';

const MIN_TIP = '0';

interface AppVideoCallTipModalProps {
  show: boolean;
  onDismiss: () => void;
  onSendTip: (amount: string) => void;
}

export default function AppVideoCallTipModal({ show, onDismiss, onSendTip }: AppVideoCallTipModalProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const snapPoints = React.useMemo(() => ['58%'], []);

  const [selectedTip, setSelectedTip] = React.useState<string>();
  const [customTip, setCustomTip] = React.useState<string>();
  const [customTipExpanded, setCustomTipExpanded] = React.useState<boolean>(false);
  const [customTipChanged, setCustomTipChanged] = React.useState<boolean>(false);
  const [customTipError, setCustomTipError] = React.useState<string>('');
  const [customTipTouched, setCustomTipTouched] = React.useState<boolean>(false);

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
    setCustomTipExpanded(old => !old);
  }, []);

  const AdvancedSetting = React.useMemo(() => accordionHeader(iconMap.setting, 'Custom Tip'), [accordionHeader]);

  const onCustomFeeChange = React.useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setCustomTip(e.nativeEvent.text);
      if (!customTipChanged) {
        setCustomTipChanged(true);
      }
      if (parseFloat(e.nativeEvent.text) < parseFloat(parseAmount(MIN_TIP))) {
        setCustomTipError(t('redeem:VCTipTooLow', { minTip: parseAmount(MIN_TIP), currency: getCoinName() }));
      } else {
        setCustomTipError('');
      }
    },
    [customTipChanged, t],
  );

  const onCustomTipBlur = React.useCallback(_ => {
    setCustomTipTouched(true);
  }, []);

  const actionButtonEnabled = React.useMemo(
    () => (customTipExpanded ? customTipChanged && !customTipError : selectedTip),
    [customTipChanged, customTipError, customTipExpanded, selectedTip],
  );

  const handleSendTip = React.useCallback(() => {
    onSendTip(customTipExpanded && customTip ? completeTokenUnit(customTip) : selectedTip ? selectedTip : '0');
  }, [onSendTip, customTipExpanded, customTip, selectedTip]);

  const tipItem = React.useCallback(
    (amount: string) => (
      <View
        style={[
          styles.tipItemContainer,
          {
            borderWidth: amount === selectedTip ? wp(0.5) : wp(0),
            borderColor: amount === selectedTip ? theme.colors.primary : undefined,
          },
        ]}>
        <TouchableRipple style={styles.tipItemTouchable} onPress={() => setSelectedTip(amount)}>
          <View style={styles.tipItemTouchable}>
            <AppTextHeading1>{parseAmount(amount)}</AppTextHeading1>
            <AppTextBody4>{getCoinName()}</AppTextBody4>
          </View>
        </TouchableRipple>
      </View>
    ),
    [selectedTip, styles.tipItemContainer, styles.tipItemTouchable, theme.colors.primary],
  );

  return (
    <AppMenuContainer
      dismissKeyboard
      tapEverywhereToDismiss={false}
      snapPoints={snapPoints}
      visible={show}
      onDismiss={onDismiss}>
      <AppTextHeading1 style={styles.headerText1}>{t('redeem:VCGiveATipTitle')}</AppTextHeading1>
      <AppTextBody4 style={styles.body1}>{t('redeem:VCGiveATipDesc')}</AppTextBody4>
      <View style={{ height: hp(3) }} />
      {!customTipExpanded ? (
        <View style={styles.tipItemGrid}>
          <View style={styles.tipRow1}>
            {tipItem('1000000000')}
            {tipItem('5000000000')}
            {tipItem('10000000000')}
          </View>
          <View style={styles.tipRow2}>
            {tipItem('50000000000')}
            {tipItem('100000000000')}
            {tipItem('500000000000')}
          </View>
        </View>
      ) : null}
      <AppAccordion expanded={customTipExpanded} title={AdvancedSetting} onPress={accordionOnPress}>
        <AppMenuFormTextInputWithError
          theme={theme as any}
          style={styles.formInput}
          returnKeyType={'go'}
          keyboardType={'number-pad'}
          autoComplete={'off'}
          autoCorrect={false}
          value={customTip}
          label={t('redeem:VCCustomTipLabel')}
          placeholder={t('redeem:VCCustomTipPlaceholder', { currency: getCoinName() })}
          onChange={onCustomFeeChange}
          error={!!customTipError && customTipTouched}
          errorText={customTipError}
          showError={customTipTouched}
          blurOnSubmit={true}
          onBlur={onCustomTipBlur}
        />
      </AppAccordion>
      <View style={styles.divider} />
      <View style={styles.actionButton}>
        <AppPrimaryButton disabled={!actionButtonEnabled} onPress={handleSendTip}>
          {t('redeem:VCSendTipButton')}
        </AppPrimaryButton>
      </View>
    </AppMenuContainer>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    divider: {
      flex: 1,
    },
    tipRow2: {
      flexDirection: 'row',
    },
    tipRow1: {
      flexDirection: 'row',
      marginBottom: wp(5),
    },
    tipItemGrid: {
      marginBottom: hp(1),
      alignItems: 'center',
    },
    actionButton: {
      paddingHorizontal: wp('5%', insets),
      marginTop: hp('4%', insets),
      marginBottom: Platform.OS === 'ios' ? insets.bottom : hp('2%', insets),
    },
    headerText1: {
      marginTop: hp('2%', insets),
      alignSelf: 'center',
      textAlign: 'center',
    },
    body1: {
      alignSelf: 'center',
      textAlign: 'center',
      marginTop: hp('2%', insets),
      marginRight: wp('5%', insets),
      marginLeft: wp('5%', insets),
    },
    tipItemContainer: {
      width: wp(25),
      height: wp(20),
      marginHorizontal: wp(2.5),
      borderRadius: wp(5),
      overflow: 'hidden',
      backgroundColor: theme.dark
        ? Color(theme.colors.background).lighten(0.6).rgb().toString()
        : Color(theme.colors.background).darken(0.12).rgb().toString(),
    },
    tipItemTouchable: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    formInput: {
      marginBottom: hp('1%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    accordionListView: {
      flexDirection: 'row',
      marginLeft: wp('1%', insets),
    },
    accordionIcon: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
  });
