import React from 'react';
import { StyleSheet, View, Keyboard, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup';

import { Theme } from '../../theme/default';
import AppHeaderWizard from '../../components/molecules/AppHeaderWizard';
import { RootStackParamList } from '../../navigation';
import AppFormTextInputWithError, {
  AppFormTextInputWithErrorProps,
} from '../../components/molecules/AppFormTextInputWithError';
import AppPrimaryButton from '../../components/atoms/button/AppPrimaryButton';
import AppView from '../../components/atoms/view/AppView';
import { hp, wp, SafeAreaInsets } from '../../utils/imageRatio';
import { useDispatch } from 'react-redux';
import AppIconComponent, {
  iconMap,
} from '../../components/atoms/icon/AppIconComponent';
import { ScrollView } from 'react-native-gesture-handler';
import AppTextBody3 from '../../components/atoms/text/AppTextBody3';
import {
  OneKindContractForm,
  OneKindContractStatusForm,
} from '../../types/screen/CreateOneKindContract';
import AppCoinChipsPicker from '../../components/organism/AppCoinChipsPicker';
import { isNameAvailable, isSymbolAvailable } from '../../service/enevti/nft';
import AppUtilityPicker from '../../components/organism/picker/AppUtilityPicker';
import AppRecurringPicker from '../../components/organism/picker/AppRecurringPicker.tsx';
import AppDateMonthPicker from '../../components/organism/datePicker/AppDateMonthPicker';
import AppDayPicker from '../../components/organism/datePicker/AppDayPicker';
import AppDatePicker from '../../components/organism/datePicker/AppDatePicker';
import AppDateMonthYearPicker from '../../components/organism/datePicker/AppDateMonthYearPicker';
import AppHourMinutePicker from '../../components/organism/datePicker/AppHourMinutePicker';
import AppRedeemLimitPicker from '../../components/organism/picker/AppRedeemLimitPicker';
import AppContentPicker from '../../components/organism/picker/AppContentPicker';
import AppMintingPeriodPicker from '../../components/organism/picker/AppMintingPeriodPicker';
import AppAccordion from '../../components/atoms/accordion/AppAccordion';

type Props = StackScreenProps<RootStackParamList, 'CreateOneKindContract'>;

const formInitialStatus: OneKindContractStatusForm = {
  nameAvailable: true,
  symbolAvailable: true,
};

const formInitialValues: OneKindContractForm = {
  name: '',
  description: '',
  symbol: '',
  priceAmount: '',
  priceCurrency: '',
  quantity: '',
  mintingExpireOption: '',
  mintingExpire: 1,
  utility: '',
  contentName: '',
  contentSize: 0,
  contentType: '',
  contentUri: '',
  recurring: '',
  timeDay: -1,
  timeDate: -1,
  timeMonth: -1,
  timeYear: -1,
  fromHour: -1,
  fromMinute: -1,
  untilHour: -1,
  untilMinute: -1,
  redeemLimitOption: '',
  redeemLimit: 1,
  royaltyOrigin: 0,
  royaltyStaker: 0,
};

const setMultipleFieldValue = (
  formik: FormikProps<OneKindContractForm>,
  keys: (keyof OneKindContractForm)[],
  initial: boolean = false,
  value?: string | number,
  shouldValidate: boolean = false,
) => {
  for (let i = 0; i < keys.length; i++) {
    if (initial) {
      formik.setFieldValue(keys[i], formInitialValues[keys[i]], shouldValidate);
    } else {
      formik.setFieldValue(keys[i], value, shouldValidate);
    }
  }
};

const setMultipleFieldTouched = (
  formik: FormikProps<OneKindContractForm>,
  keys: (keyof OneKindContractForm)[],
  value: boolean,
  shouldValidate: boolean = false,
) => {
  for (let i = 0; i < keys.length; i++) {
    formik.setFieldTouched(keys[i], value, shouldValidate);
  }
};

const resetRedeemTimeKeyFields = (formik: FormikProps<OneKindContractForm>) => {
  setMultipleFieldValue(formik, redeemTimeKey, true);
  setMultipleFieldTouched(formik, redeemTimeKey, false);
};

const redeemTimeKey: (keyof OneKindContractForm)[] = [
  'timeYear',
  'timeMonth',
  'timeDay',
  'timeDate',
  'fromHour',
  'fromMinute',
  'untilHour',
  'untilMinute',
  'redeemLimitOption',
  'redeemLimit',
];

const contentKey: (keyof OneKindContractForm)[] = [
  'contentName',
  'contentSize',
  'contentType',
  'contentUri',
];

export default function CreateOneKindContract({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const paperTheme = useTheme();
  const theme = paperTheme as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);
  const timezoneOffset = React.useMemo(
    () => new Date().getTimezoneOffset(),
    [],
  );

  const nameInput = React.useRef<TextInput>();
  const descriptionInput = React.useRef<TextInput>();
  const symbolInput = React.useRef<TextInput>();
  const priceInput = React.useRef<TextInput>();
  const quantityInput = React.useRef<TextInput>();
  const mintingPeriodInput = React.useRef<TextInput>();
  const redeemLimitInput = React.useRef<TextInput>();
  const creatorRoyaltyInput = React.useRef<TextInput>();
  const stakerRoyaltyInput = React.useRef<TextInput>();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activePrice, setActivePrice] = React.useState<boolean>(false);
  const [identityExpanded, setIdentityExpanded] = React.useState<boolean>(true);
  const [mintingExpanded, setMintingExpanded] = React.useState<boolean>(true);
  const [utilityExpanded, setUtilityExpanded] = React.useState<boolean>(true);
  const [royaltyExpanded, setRoyaltyExpanded] = React.useState<boolean>(true);

  const validationSchema = React.useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t('form:required')),
        description: Yup.string().required(t('form:required')),
        symbol: Yup.string().required(t('form:required')),
        priceAmount: Yup.string().required(t('form:required')),
        quantity: Yup.number().moreThan(0).required(t('form:required')),
        mintingExpire: Yup.number().required(t('form:required')),
      }),
    [t],
  );

  const formikProps = useFormik({
    initialValues: formInitialValues,
    initialStatus: formInitialStatus,
    onSubmit: async values => {
      Keyboard.dismiss();
      setIsLoading(true);
      await handleFormSubmit(values);
    },
    validationSchema: validationSchema,
  });

  const handleFormSubmit = async (values: any) => {
    console.log(values);
  };

  const nextRefCallback = React.useCallback(
    nextref => () => nextref && nextref.current?.focus(),
    [],
  );

  const commonOnEndEditing = React.useCallback(
    (key, formik) => (e: any) =>
      formik.setFieldValue(key, e.nativeEvent.text, true),
    [],
  );

  const commonOnBlur = React.useCallback(
    (key, formik) => () => formik.setFieldTouched(key),
    [],
  );

  const onFocusPriceInput = React.useCallback(() => setActivePrice(true), []);

  const onBlurPriceInput = React.useCallback(() => {
    !formikProps.touched.priceAmount &&
      formikProps.setFieldTouched('priceAmount');
    setActivePrice(false);
  }, [formikProps]);

  const onSelectedMintingPeriodPicker = React.useCallback(item => {
    formikProps.setFieldValue('mintingExpireOption', item.value, false);
    if (item.value === 'no-limit') {
      formikProps.setFieldValue('mintingExpire', 0, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedUtilityPicker = React.useCallback(item => {
    formikProps.setFieldValue('utility', item.value, false);
    if (item.value === 'content') {
      formikProps.setFieldValue('recurring', 'anytime', false);
      resetRedeemTimeKeyFields(formikProps);
    } else {
      setMultipleFieldValue(formikProps, contentKey, true);
      setMultipleFieldTouched(formikProps, contentKey, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteContentPicker = React.useCallback(() => {
    setMultipleFieldValue(formikProps, contentKey, true);
    setMultipleFieldTouched(formikProps, contentKey, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedContentPicker = React.useCallback(item => {
    formikProps.setFieldValue('contentName', item.name, false);
    formikProps.setFieldValue('contentSize', item.size, false);
    formikProps.setFieldValue('contentType', item.type, false);
    formikProps.setFieldValue('contentUri', item.uri, false);
    setMultipleFieldTouched(formikProps, contentKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedRecurringPicker = React.useCallback(item => {
    formikProps.setFieldValue('recurring', item.value, false);
    resetRedeemTimeKeyFields(formikProps);
    if (item.value === 'every-day') {
      setMultipleFieldTouched(formikProps, ['timeDay', 'timeDate'], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDayPicker = React.useCallback(value => {
    formikProps.setFieldValue('timeDay', value[0], false);
    formikProps.setFieldTouched('timeDay', true, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDatePicker = React.useCallback(value => {
    formikProps.setFieldValue('timeDate', value[0], false);
    formikProps.setFieldTouched('timeDate', true, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDateMonthPicker = React.useCallback(value => {
    formikProps.setFieldValue('timeMonth', value[0], false);
    formikProps.setFieldValue('timeDate', value[1], false);
    setMultipleFieldTouched(formikProps, ['timeMonth', 'timeDate'], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedDateMonthYearPicker = React.useCallback(value => {
    formikProps.setFieldValue('timeYear', value[0], false);
    formikProps.setFieldValue('timeMonth', value[1], false);
    formikProps.setFieldValue('timeDate', value[2], false);
    setMultipleFieldTouched(
      formikProps,
      ['timeYear', 'timeMonth', 'timeDate'],
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedHourMinutePickerStart = React.useCallback(value => {
    formikProps.setFieldValue('fromHour', value[0], false);
    formikProps.setFieldValue('fromMinute', value[1], false);
    setMultipleFieldTouched(formikProps, ['fromHour', 'fromMinute'], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedHourMinutePickerEnd = React.useCallback(value => {
    formikProps.setFieldValue('untilHour', value[0], false);
    formikProps.setFieldValue('untilMinute', value[1], false);
    setMultipleFieldTouched(formikProps, ['untilHour', 'untilMinute'], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectedRedeemLimitPicker = React.useCallback(item => {
    formikProps.setFieldValue('redeemLimitOption', item.value, false);
    if (item.value === 'no-limit') {
      formikProps.setFieldValue('redeemLimit', 0, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const labelHourMinutePickerStart = React.useMemo(
    () =>
      t('createNFT:redeemStartTime') +
      ` (UTC${timezoneOffset > 0 ? '-' : '+'}${(timezoneOffset * -1) / 60})`,
    [t, timezoneOffset],
  );

  const labelHourMinutePickerEnd = React.useMemo(
    () =>
      t('createNFT:redeemEndTime') +
      ` (UTC${timezoneOffset > 0 ? '-' : '+'}${(timezoneOffset * -1) / 60})`,
    [t, timezoneOffset],
  );

  const dateMonthPickerValue = React.useMemo(
    () => [formikProps.values.timeMonth, formikProps.values.timeDate],
    [formikProps.values.timeMonth, formikProps.values.timeDate],
  );

  const dayPickerValue = React.useMemo(
    () => [formikProps.values.timeDay],
    [formikProps.values.timeDay],
  );

  const datePickerValue = React.useMemo(
    () => [formikProps.values.timeDate],
    [formikProps.values.timeDate],
  );

  const dateMonthYearPickerValue = React.useMemo(
    () => [
      formikProps.values.timeYear,
      formikProps.values.timeMonth,
      formikProps.values.timeDate,
    ],
    [
      formikProps.values.timeYear,
      formikProps.values.timeMonth,
      formikProps.values.timeDate,
    ],
  );

  const hourMinuteStartValue = React.useMemo(
    () => [formikProps.values.fromHour, formikProps.values.fromMinute],
    [formikProps.values.fromHour, formikProps.values.fromMinute],
  );

  const hourMinuteEndValue = React.useMemo(
    () => [formikProps.values.untilHour, formikProps.values.untilMinute],
    [formikProps.values.untilHour, formikProps.values.untilMinute],
  );

  const contentPickerValue = React.useMemo(
    () => ({
      fileCopyUri: null,
      name: formikProps.values.contentName,
      size: formikProps.values.contentSize,
      type: formikProps.values.contentType,
      uri: formikProps.values.contentUri,
    }),
    [
      formikProps.values.contentName,
      formikProps.values.contentSize,
      formikProps.values.contentType,
      formikProps.values.contentUri,
    ],
  );

  const CoinChips = React.useMemo(
    () => (
      <AppCoinChipsPicker
        active={activePrice}
        error={
          formikProps.touched.priceAmount && !!formikProps.errors.priceAmount
        }
      />
    ),
    [
      formikProps.touched.priceAmount,
      formikProps.errors.priceAmount,
      activePrice,
    ],
  );

  const commonFormInput = React.useCallback(
    (
      formik: FormikProps<OneKindContractForm>,
      ref: React.MutableRefObject<TextInput | undefined>,
      key: keyof OneKindContractForm,
      label: string,
      placeholder: string,
      options?: Omit<AppFormTextInputWithErrorProps, 'theme'>,
      nextref?: React.MutableRefObject<TextInput | undefined>,
    ) => (
      <AppFormTextInputWithError
        ref={ref}
        theme={paperTheme}
        dense={true}
        style={styles.formInput}
        returnKeyType={'go'}
        autoComplete={'off'}
        autoCorrect={false}
        defaultValue={formik.values[key].toString()}
        label={label}
        placeholder={placeholder}
        onBlur={commonOnBlur(key, formik)}
        errorText={formik.errors[key]}
        error={formik.touched[key] && !!formik.errors[key]}
        showError={formik.touched[key]}
        onEndEditing={commonOnEndEditing(key, formik)}
        onSubmitEditing={nextRefCallback(nextref)}
        {...options}
      />
    ),
    [
      paperTheme,
      styles.formInput,
      nextRefCallback,
      commonOnEndEditing,
      commonOnBlur,
    ],
  );

  const accordionHeader = React.useCallback(
    (icon: string, text: string) => (
      <View style={styles.accordionListView}>
        <AppIconComponent
          name={icon}
          color={theme.colors.text}
          size={20}
          style={styles.accordionIcon}
        />
        <AppTextBody3>{text}</AppTextBody3>
      </View>
    ),
    [styles.accordionIcon, styles.accordionListView, theme.colors.text],
  );

  const identityHeader = React.useMemo(
    () => accordionHeader(iconMap.identity, t('createNFT:nftIdentity')),
    [accordionHeader, t],
  );

  const identityHeaderCallback = React.useCallback(
    () => setIdentityExpanded(!identityExpanded),
    [identityExpanded],
  );

  const mintingHeader = React.useMemo(
    () =>
      accordionHeader(
        iconMap.mintingBehaviour,
        t('createNFT:nftMintingBehaviour'),
      ),
    [accordionHeader, t],
  );

  const mintingHeaderCallback = React.useCallback(
    () => setMintingExpanded(!mintingExpanded),
    [mintingExpanded],
  );

  const utilityHeader = React.useMemo(
    () => accordionHeader(iconMap.utility, t('createNFT:nftUtility')),
    [accordionHeader, t],
  );

  const utilityHeaderCallback = React.useCallback(
    () => setUtilityExpanded(!utilityExpanded),
    [utilityExpanded],
  );

  const royaltyHeader = React.useMemo(
    () => accordionHeader(iconMap.royalty, t('createNFT:nftRoyalty')),
    [accordionHeader, t],
  );

  const royaltyHeaderCallback = React.useCallback(
    () => setRoyaltyExpanded(!royaltyExpanded),
    [royaltyExpanded],
  );

  return (
    <AppView withModal>
      <ScrollView>
        <AppHeaderWizard
          back
          backIcon={iconMap.close}
          navigation={navigation}
          title={t('createNFT:setupContract')}
          description={t('createNFT:setupContractDescription')}
          style={styles.header}
          memoKey={[]}
        />

        <View style={styles.formView}>
          <AppAccordion
            expanded={identityExpanded}
            onPress={identityHeaderCallback}
            title={identityHeader}>
            {commonFormInput(
              formikProps,
              nameInput,
              'name',
              t('createNFT:collectionName'),
              t('createNFT:collectionNamePlaceholder'),
              {
                autoCapitalize: 'words',
                maxLength: 20,
                memoKey: ['error', 'showError'],
                errorText: !formikProps.status.nameAvailable
                  ? t('createNFT:nameUnavailable')
                  : formikProps.errors.name,
                error:
                  formikProps.touched.name &&
                  (!formikProps.status.nameAvailable ||
                    !!formikProps.errors.name),
                onEndEditing: async e => {
                  const text = e.nativeEvent.text;
                  const nameAvailable = await isNameAvailable(text);
                  formikProps.setFieldValue('name', text, true);
                  formikProps.setStatus({
                    ...formikProps.status,
                    nameAvailable,
                  });
                },
              },
              descriptionInput,
            )}
            {commonFormInput(
              formikProps,
              descriptionInput,
              'description',
              t('createNFT:collectionDescription'),
              t('createNFT:collectionDescriptionPlaceholder'),
              {
                multiline: true,
                numberOfLines: 5,
                maxLength: 280,
                memoKey: ['error', 'showError'],
              },
            )}
            {commonFormInput(
              formikProps,
              symbolInput,
              'symbol',
              t('createNFT:collectionSymbol'),
              t('createNFT:collectionSymbolPlaceholder'),
              {
                autoCapitalize: 'characters',
                maxLength: 10,
                memoKey: ['error', 'showError'],
                errorText: !formikProps.status.symbolAvailable
                  ? t('createNFT:symbolUnavailable')
                  : formikProps.errors.symbol,
                error:
                  formikProps.touched.symbol &&
                  (!formikProps.status.symbolAvailable ||
                    !!formikProps.errors.symbol),
                onEndEditing: async e => {
                  const text = e.nativeEvent.text;
                  const symbolAvailable = await isSymbolAvailable(text);
                  formikProps.setFieldValue('symbol', text, true);
                  formikProps.setStatus({
                    ...formikProps.status,
                    symbolAvailable,
                  });
                },
              },
            )}
          </AppAccordion>

          <AppAccordion
            expanded={mintingExpanded}
            onPress={mintingHeaderCallback}
            title={mintingHeader}>
            {commonFormInput(
              formikProps,
              priceInput,
              'priceAmount',
              t('createNFT:collectionPrice'),
              t('createNFT:collectionPricePlaceholder'),
              {
                onFocus: onFocusPriceInput,
                onBlur: onBlurPriceInput,
                keyboardType: 'number-pad',
                hideMaxLengthIndicator: true,
                maxLength: 13,
                rowEndComponent: CoinChips,
                memoKey: ['error', 'showError', 'rowEndComponent'],
              },
              quantityInput,
            )}
            {commonFormInput(
              formikProps,
              quantityInput,
              'quantity',
              t('createNFT:collectionQuantity'),
              t('createNFT:collectionQuantityPlaceholder'),
              {
                memoKey: ['error', 'showError'],
                keyboardType: 'number-pad',
                errorText: formikProps.errors.quantity
                  ? parseFloat(formikProps.values.quantity) <= 0
                    ? t('form:greaterThanZero')
                    : t('form:required')
                  : '',
              },
            )}
            <AppMintingPeriodPicker
              label={t('createNFT:mintingPeriodLimit')}
              value={formikProps.values.mintingExpireOption}
              onSelected={onSelectedMintingPeriodPicker}
            />
            {formikProps.values.mintingExpireOption === 'fixed'
              ? commonFormInput(
                  formikProps,
                  mintingPeriodInput,
                  'mintingExpire',
                  t('createNFT:collectionMintingExpire'),
                  t('createNFT:collectionMintingExpirePlaceholder'),
                  {
                    memoKey: ['error', 'showError'],
                    keyboardType: 'number-pad',
                  },
                )
              : null}
          </AppAccordion>

          <AppAccordion
            expanded={utilityExpanded}
            onPress={utilityHeaderCallback}
            title={utilityHeader}>
            <AppUtilityPicker
              value={formikProps.values.utility}
              onSelected={onSelectedUtilityPicker}
            />

            <View style={{ height: hp('1%', insets) }} />

            {formikProps.values.utility &&
            formikProps.values.utility === 'content' ? (
              <AppContentPicker
                value={contentPickerValue}
                onDelete={onDeleteContentPicker}
                onSelected={onSelectedContentPicker}
              />
            ) : null}

            {formikProps.values.utility &&
            formikProps.values.utility !== 'content' ? (
              <>
                <AppRecurringPicker
                  value={formikProps.values.recurring}
                  onSelected={onSelectedRecurringPicker}
                />
                <View style={{ height: hp('1%', insets) }} />
              </>
            ) : null}

            {formikProps.values.recurring === 'every-week' ? (
              <AppDayPicker
                label={t('createNFT:redeemDay')}
                onSelected={onSelectedDayPicker}
                value={dayPickerValue}
              />
            ) : formikProps.values.recurring === 'every-month' ? (
              <AppDatePicker
                label={t('createNFT:redeemDate')}
                onSelected={onSelectedDatePicker}
                value={datePickerValue}
              />
            ) : formikProps.values.recurring === 'every-year' ? (
              <AppDateMonthPicker
                label={t('createNFT:redeemMonthAndDate')}
                onSelected={onSelectedDateMonthPicker}
                value={dateMonthPickerValue}
              />
            ) : formikProps.values.recurring === 'once' ? (
              <AppDateMonthYearPicker
                label={t('createNFT:redeemYearMonthAndaDate')}
                onSelected={onSelectedDateMonthYearPicker}
                value={dateMonthYearPickerValue}
              />
            ) : null}

            {formikProps.touched.timeDay || formikProps.touched.timeDate ? (
              <AppHourMinutePicker
                label={labelHourMinutePickerStart}
                onSelected={onSelectedHourMinutePickerStart}
                value={hourMinuteStartValue}
              />
            ) : null}

            {formikProps.touched.fromHour && formikProps.touched.fromMinute ? (
              <AppHourMinutePicker
                label={labelHourMinutePickerEnd}
                onSelected={onSelectedHourMinutePickerEnd}
                value={hourMinuteEndValue}
              />
            ) : null}

            {formikProps.touched.untilHour &&
            formikProps.touched.untilMinute &&
            formikProps.values.recurring !== 'once' ? (
              <AppRedeemLimitPicker
                label={t('createNFT:redeemLimit')}
                value={formikProps.values.redeemLimitOption}
                onSelected={onSelectedRedeemLimitPicker}
              />
            ) : null}

            {formikProps.values.redeemLimitOption === 'fixed'
              ? commonFormInput(
                  formikProps,
                  redeemLimitInput,
                  'redeemLimit',
                  t('createNFT:redeemLimitCount'),
                  t('createNFT:redeemLimitCountPlaceholder'),
                  {
                    memoKey: ['error', 'showError'],
                    keyboardType: 'number-pad',
                  },
                )
              : null}
          </AppAccordion>

          <AppAccordion
            expanded={royaltyExpanded}
            onPress={royaltyHeaderCallback}
            title={royaltyHeader}>
            {commonFormInput(
              formikProps,
              creatorRoyaltyInput,
              'royaltyOrigin',
              t('createNFT:collectionRoyaltyOrigin'),
              t('createNFT:collectionRoyaltyOriginDescription'),
              {
                memoKey: ['error', 'showError'],
                keyboardType: 'number-pad',
              },
              stakerRoyaltyInput,
            )}
            {commonFormInput(
              formikProps,
              stakerRoyaltyInput,
              'royaltyStaker',
              t('createNFT:collectionRoyaltyStaker'),
              t('createNFT:collectionRoyaltyStakerDescription'),
              {
                memoKey: ['error', 'showError'],
                keyboardType: 'number-pad',
              },
            )}
          </AppAccordion>
        </View>

        <View style={styles.actionContainer}>
          <View style={{ height: hp('3%', insets) }} />

          <AppPrimaryButton
            onPress={formikProps.handleSubmit}
            loading={isLoading}
            disabled={!(formikProps.isValid && formikProps.dirty)}
            style={styles.createAccount}>
            {t('auth:import')}
          </AppPrimaryButton>
        </View>
      </ScrollView>
    </AppView>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    accordionListView: {
      flexDirection: 'row',
      marginLeft: wp('1%', insets),
    },
    accordionIcon: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
    actionContainer: {
      flexDirection: 'column-reverse',
    },
    createAccount: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    header: {
      flex: 0,
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
      marginBottom: hp('3%', insets),
    },
    formView: {
      flex: 0,
    },
    formInput: {
      marginBottom: hp('1%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
