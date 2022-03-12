import React from 'react';
import { StyleSheet, View, Keyboard, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { List, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { encryptWithPassword } from '../../utils/cryptography';
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
import { iconMap } from '../../components/atoms/icon/AppIconComponent';
import { ScrollView } from 'react-native-gesture-handler';
import AppTextBody3 from '../../components/atoms/text/AppTextBody3';
import AppIconGradient from '../../components/molecules/AppIconGradient';
import {
  OneKindContractForm,
  OneKindContractStatusForm,
} from '../../types/screen/CreateOneKindContract';
import AppCoinChipsPicker from '../../components/organism/AppCoinChipsPicker';
import NumberFormat from 'react-number-format';
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
  mintingExpire: '',
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

const redeemTimeKey: (keyof OneKindContractForm)[] = [
  'timeYear',
  'timeMonth',
  'timeDay',
  'timeDate',
  'fromHour',
  'fromMinute',
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

  const handleFormSubmit = async (values: any) => {
    console.log(values);
  };

  const accordionHeader = (icon: string, text: string) => (
    <View style={styles.accordionListView}>
      <AppIconGradient
        name={icon}
        colors={[theme.colors.primary, theme.colors.secondary]}
        size={20}
        style={styles.accordionIcon}
      />
      <AppTextBody3>{text}</AppTextBody3>
    </View>
  );

  const commonFormInput = React.useCallback(
    (
      formikProps: FormikProps<OneKindContractForm>,
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
        defaultValue={formikProps.values[key].toString()}
        label={label}
        placeholder={placeholder}
        onBlur={() => formikProps.setFieldTouched(key)}
        errorText={formikProps.errors[key]}
        error={formikProps.touched[key] && !!formikProps.errors[key]}
        showError={formikProps.touched[key]}
        onEndEditing={e =>
          formikProps.setFieldValue(key, e.nativeEvent.text, true)
        }
        onSubmitEditing={() => nextref && nextref.current?.focus()}
        {...options}
      />
    ),
    [paperTheme, styles.formInput],
  );

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
        />

        <Formik
          initialValues={formInitialValues}
          initialStatus={formInitialStatus}
          onSubmit={async values => {
            Keyboard.dismiss();
            setIsLoading(true);
            await handleFormSubmit(values);
          }}
          validationSchema={validationSchema}>
          {formikProps => (
            <>
              <View style={styles.passwordView}>
                <List.Section>
                  <List.Accordion
                    title={accordionHeader(
                      iconMap.identity,
                      t('createNFT:nftIdentity'),
                    )}>
                    {commonFormInput(
                      formikProps,
                      nameInput,
                      'name',
                      t('createNFT:collectionName'),
                      t('createNFT:collectionNamePlaceholder'),
                      {
                        autoCapitalize: 'words',
                        maxLength: 20,
                        memoKey: ['errorText', 'error', 'showError'],
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
                        memoKey: ['errorText', 'error', 'showError'],
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
                        memoKey: ['errorText', 'error', 'showError'],
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
                  </List.Accordion>

                  <List.Accordion
                    title={accordionHeader(
                      iconMap.mintingBehaviour,
                      t('createNFT:nftMintingBehaviour'),
                    )}>
                    <NumberFormat
                      value={formikProps.values.priceAmount}
                      displayType={'text'}
                      thousandSeparator={true}
                      renderText={value =>
                        commonFormInput(
                          formikProps,
                          priceInput,
                          'priceAmount',
                          t('createNFT:collectionPrice'),
                          t('createNFT:collectionPricePlaceholder'),
                          {
                            value: value,
                            defaultValue: undefined,
                            onEndEditing: undefined,
                            onChangeText:
                              formikProps.handleChange('priceAmount'),
                            keyboardType: 'number-pad',
                            hideMaxLengthIndicator: true,
                            maxLength: 13,
                            endComponent: <AppCoinChipsPicker />,
                            memoKey: [
                              'value',
                              'errorText',
                              'error',
                              'showError',
                            ],
                          },
                          quantityInput,
                        )
                      }
                    />
                    {commonFormInput(
                      formikProps,
                      quantityInput,
                      'quantity',
                      t('createNFT:collectionQuantity'),
                      t('createNFT:collectionQuantityPlaceholder'),
                      {
                        memoKey: ['errorText', 'error', 'showError'],
                        keyboardType: 'number-pad',
                        errorText: formikProps.errors.quantity
                          ? parseFloat(formikProps.values.quantity) <= 0
                            ? t('form:greaterThanZero')
                            : t('form:required')
                          : '',
                      },
                      mintingPeriodInput,
                    )}
                    {commonFormInput(
                      formikProps,
                      mintingPeriodInput,
                      'mintingExpire',
                      t('createNFT:collectionMintingExpire'),
                      t('createNFT:collectionMintingExpirePlaceholder'),
                      {
                        memoKey: ['errorText', 'error', 'showError'],
                        keyboardType: 'number-pad',
                      },
                    )}
                  </List.Accordion>

                  <List.Accordion
                    title={accordionHeader(iconMap.utility, 'Utility')}>
                    <AppUtilityPicker
                      value={formikProps.values.utility}
                      onSelected={item => {
                        formikProps.setFieldValue('utility', item.value, false);
                        if (item.value === 'content') {
                          formikProps.setFieldValue(
                            'recurring',
                            'anytime',
                            false,
                          );
                          setMultipleFieldValue(
                            formikProps,
                            redeemTimeKey.concat(['redeemLimitOption']),
                            true,
                          );
                          setMultipleFieldTouched(
                            formikProps,
                            redeemTimeKey.concat(['untilHour', 'untilMinute']),
                            false,
                          );
                        } else {
                          setMultipleFieldValue(formikProps, contentKey, true);
                          setMultipleFieldTouched(
                            formikProps,
                            contentKey,
                            false,
                          );
                        }
                      }}
                    />

                    <View style={{ height: hp('1%', insets) }} />

                    {formikProps.values.utility &&
                    formikProps.values.utility === 'content' ? (
                      <AppContentPicker
                        value={{
                          fileCopyUri: null,
                          name: formikProps.values.contentName,
                          size: formikProps.values.contentSize,
                          type: formikProps.values.contentType,
                          uri: formikProps.values.contentUri,
                        }}
                        onDelete={() => {
                          setMultipleFieldValue(formikProps, contentKey, true);
                          setMultipleFieldTouched(
                            formikProps,
                            contentKey,
                            false,
                          );
                        }}
                        onSelected={item => {
                          formikProps.setFieldValue(
                            'contentName',
                            item.name,
                            false,
                          );
                          formikProps.setFieldValue(
                            'contentSize',
                            item.size,
                            false,
                          );
                          formikProps.setFieldValue(
                            'contentType',
                            item.type,
                            false,
                          );
                          formikProps.setFieldValue(
                            'contentUri',
                            item.uri,
                            false,
                          );
                          setMultipleFieldTouched(
                            formikProps,
                            contentKey,
                            true,
                          );
                        }}
                      />
                    ) : null}

                    {formikProps.values.utility &&
                    formikProps.values.utility !== 'content' ? (
                      <>
                        <AppRecurringPicker
                          value={formikProps.values.recurring}
                          onSelected={item => {
                            formikProps.setFieldValue(
                              'recurring',
                              item.value,
                              false,
                            );
                            setMultipleFieldValue(
                              formikProps,
                              redeemTimeKey.concat(['redeemLimitOption']),
                              true,
                            );
                            setMultipleFieldTouched(
                              formikProps,
                              redeemTimeKey.concat([
                                'untilHour',
                                'untilMinute',
                              ]),
                              false,
                            );
                            if (item.value === 'every-day') {
                              setMultipleFieldTouched(
                                formikProps,
                                ['timeDay', 'timeDate'],
                                true,
                              );
                            }
                          }}
                        />
                        <View style={{ height: hp('1%', insets) }} />
                      </>
                    ) : null}

                    {formikProps.values.recurring === 'every-week' ? (
                      <AppDayPicker
                        label={t('createNFT:redeemDay')}
                        onSelected={value => {
                          formikProps.setFieldValue('timeDay', value[0], false);
                          formikProps.setFieldTouched('timeDay', true, false);
                        }}
                        value={[formikProps.values.timeDay]}
                      />
                    ) : formikProps.values.recurring === 'every-month' ? (
                      <AppDatePicker
                        label={t('createNFT:redeemDate')}
                        onSelected={value => {
                          formikProps.setFieldValue(
                            'timeDate',
                            value[0],
                            false,
                          );
                          formikProps.setFieldTouched('timeDate', true, false);
                        }}
                        value={[formikProps.values.timeDate]}
                      />
                    ) : formikProps.values.recurring === 'every-year' ? (
                      <AppDateMonthPicker
                        label={t('createNFT:redeemMonthAndDate')}
                        onSelected={value => {
                          formikProps.setFieldValue(
                            'timeMonth',
                            value[0],
                            false,
                          );
                          formikProps.setFieldValue(
                            'timeDate',
                            value[1],
                            false,
                          );
                          setMultipleFieldTouched(
                            formikProps,
                            ['timeMonth', 'timeDate'],
                            true,
                          );
                        }}
                        value={[
                          formikProps.values.timeMonth,
                          formikProps.values.timeDate,
                        ]}
                      />
                    ) : formikProps.values.recurring === 'once' ? (
                      <AppDateMonthYearPicker
                        label={t('createNFT:redeemYearMonthAndaDate')}
                        onSelected={value => {
                          formikProps.setFieldValue(
                            'timeYear',
                            value[0],
                            false,
                          );
                          formikProps.setFieldValue(
                            'timeMonth',
                            value[1],
                            false,
                          );
                          formikProps.setFieldValue(
                            'timeDate',
                            value[2],
                            false,
                          );
                          setMultipleFieldTouched(
                            formikProps,
                            ['timeYear', 'timeMonth', 'timeDate'],
                            true,
                          );
                        }}
                        value={[
                          formikProps.values.timeYear,
                          formikProps.values.timeMonth,
                          formikProps.values.timeDate,
                        ]}
                      />
                    ) : null}

                    {formikProps.touched.timeDay ||
                    formikProps.touched.timeDate ? (
                      <AppHourMinutePicker
                        label={
                          t('createNFT:redeemStartTime') +
                          ` (UTC${timezoneOffset > 0 ? '-' : '+'}${
                            (timezoneOffset * -1) / 60
                          })`
                        }
                        onSelected={value => {
                          formikProps.setFieldValue(
                            'fromHour',
                            value[0],
                            false,
                          );
                          formikProps.setFieldValue(
                            'fromMinute',
                            value[1],
                            false,
                          );
                          setMultipleFieldTouched(
                            formikProps,
                            ['fromHour', 'fromMinute'],
                            true,
                          );
                        }}
                        value={[
                          formikProps.values.fromHour,
                          formikProps.values.fromMinute,
                        ]}
                      />
                    ) : null}

                    {formikProps.touched.fromHour &&
                    formikProps.touched.fromMinute ? (
                      <AppHourMinutePicker
                        label={
                          t('createNFT:redeemEndTime') +
                          ` (UTC${timezoneOffset > 0 ? '-' : '+'}${
                            (timezoneOffset * -1) / 60
                          })`
                        }
                        onSelected={value => {
                          formikProps.setFieldValue(
                            'untilHour',
                            value[0],
                            false,
                          );
                          formikProps.setFieldValue(
                            'untilMinute',
                            value[1],
                            false,
                          );
                          setMultipleFieldTouched(
                            formikProps,
                            ['untilHour', 'untilMinute'],
                            true,
                          );
                        }}
                        value={[
                          formikProps.values.untilHour,
                          formikProps.values.untilMinute,
                        ]}
                      />
                    ) : null}

                    {formikProps.touched.untilHour &&
                    formikProps.touched.untilMinute ? (
                      <AppRedeemLimitPicker
                        label={t('createNFT:redeemLimit')}
                        value={formikProps.values.redeemLimitOption}
                        onSelected={item => {
                          formikProps.setFieldValue(
                            'redeemLimitOption',
                            item.value,
                            false,
                          );
                          if (item.value === 'no-limit') {
                            formikProps.setFieldValue('redeemLimit', 0, false);
                          }
                        }}
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
                            memoKey: ['errorText', 'error', 'showError'],
                            keyboardType: 'number-pad',
                          },
                        )
                      : null}
                  </List.Accordion>

                  <List.Accordion
                    title={accordionHeader(
                      iconMap.royalty,
                      t('createNFT:nftRoyalty'),
                    )}>
                    {commonFormInput(
                      formikProps,
                      creatorRoyaltyInput,
                      'royaltyOrigin',
                      t('createNFT:collectionRoyaltyOrigin'),
                      t('createNFT:collectionRoyaltyOriginDescription'),
                      {
                        memoKey: ['errorText', 'error', 'showError'],
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
                        memoKey: ['errorText', 'error', 'showError'],
                        keyboardType: 'number-pad',
                      },
                    )}
                  </List.Accordion>
                </List.Section>
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
            </>
          )}
        </Formik>
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
    passwordView: {
      flex: 0,
    },
    formInput: {
      marginBottom: hp('1%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
