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
import { setEncryptedPassphraseAuth } from '../../store/slices/auth';
import { setLocalSessionKey } from '../../store/slices/session/local';
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
  recurring: '',
  timeDay: -1,
  timeDate: 0,
  timeMonth: 0,
  timeYear: 0,
  fromHour: 0,
  fromMinute: 0,
  until: 0,
  redeemLimit: 0,
  royaltyOrigin: 0,
  royaltyStaker: 0,
};

export default function CreateOneKindContract({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const paperTheme = useTheme();
  const theme = paperTheme as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  const passwordInput = React.useRef<TextInput>();
  const nameInput = React.useRef<TextInput>();
  const descriptionInput = React.useRef<TextInput>();
  const symbolInput = React.useRef<TextInput>();
  const priceInput = React.useRef<TextInput>();
  const quantityInput = React.useRef<TextInput>();
  const mintingPeriodInput = React.useRef<TextInput>();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async (values: any) => {
    const encryptedPassphrase = await encryptWithPassword(
      values.passphrase,
      values.password,
    );
    dispatch(setEncryptedPassphraseAuth(encryptedPassphrase));
    dispatch(setLocalSessionKey(values.password));
    setIsLoading(false);
    navigation.replace('AccountCreated');
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
        style={styles.passwordInput}
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
    [paperTheme, styles.passwordInput],
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
                        }
                      }}
                    />

                    <View style={{ height: hp('1%', insets) }} />

                    {formikProps.values.utility &&
                    formikProps.values.utility !== 'content' ? (
                      <>
                        <AppRecurringPicker
                          value={formikProps.values.recurring}
                          onSelected={item =>
                            formikProps.setFieldValue(
                              'recurring',
                              item.value,
                              false,
                            )
                          }
                        />
                        <View style={{ height: hp('1%', insets) }} />
                      </>
                    ) : null}

                    {formikProps.values.recurring === 'every-week' ? (
                      <AppDayPicker
                        onSelected={value => {
                          formikProps.setFieldValue('timeDay', value[0], false);
                        }}
                        value={[formikProps.values.timeDay]}
                      />
                    ) : formikProps.values.recurring === 'every-month' ? (
                      <AppDatePicker
                        onSelected={value => {
                          formikProps.setFieldValue(
                            'timeDate',
                            value[0],
                            false,
                          );
                        }}
                        value={[formikProps.values.timeDate]}
                      />
                    ) : formikProps.values.recurring === 'every-year' ? (
                      <AppDateMonthPicker
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
                        }}
                        value={[
                          formikProps.values.timeMonth,
                          formikProps.values.timeDate,
                        ]}
                      />
                    ) : formikProps.values.recurring === 'once' ? (
                      <AppDateMonthYearPicker
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
                        }}
                        value={[
                          formikProps.values.timeYear,
                          formikProps.values.timeMonth,
                          formikProps.values.timeDate,
                        ]}
                      />
                    ) : null}

                    <AppFormTextInputWithError
                      label={'Redeem Start Time'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyOrigin.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyOrigin')
                      }
                      errorText={
                        formikProps.errors.royaltyOrigin
                          ? formikProps.values.royaltyOrigin > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyOrigin}
                      onChangeText={formikProps.handleChange('royaltyOrigin')}
                      onSubmitEditing={() => passwordInput.current?.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                    <AppFormTextInputWithError
                      label={'Redeem End Time'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyOrigin.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyOrigin')
                      }
                      errorText={
                        formikProps.errors.royaltyOrigin
                          ? formikProps.values.royaltyOrigin > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyOrigin}
                      onChangeText={formikProps.handleChange('royaltyOrigin')}
                      onSubmitEditing={() => passwordInput.current?.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                    <AppFormTextInputWithError
                      label={'Redeem Limit'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyOrigin.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyOrigin')
                      }
                      errorText={
                        formikProps.errors.royaltyOrigin
                          ? formikProps.values.royaltyOrigin > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyOrigin}
                      onChangeText={formikProps.handleChange('royaltyOrigin')}
                      onSubmitEditing={() => passwordInput.current?.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                  </List.Accordion>

                  <List.Accordion
                    title={'Royalty'}
                    titleStyle={{
                      fontSize: wp('4.0%', insets),
                      marginLeft: wp('1%', insets),
                    }}>
                    <AppFormTextInputWithError
                      label={'Creator Royalty (%)'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyOrigin.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyOrigin')
                      }
                      errorText={
                        formikProps.errors.royaltyOrigin
                          ? formikProps.values.royaltyOrigin > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyOrigin}
                      onChangeText={formikProps.handleChange('royaltyOrigin')}
                      onSubmitEditing={() => passwordInput.current?.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
                    <AppFormTextInputWithError
                      label={'Staker Royalty (%)'}
                      theme={paperTheme}
                      dense={true}
                      autoCapitalize={'none'}
                      style={styles.passwordInput}
                      value={formikProps.values.royaltyStaker.toString()}
                      onBlur={() =>
                        formikProps.setFieldTouched('royaltyStaker')
                      }
                      errorText={
                        formikProps.errors.royaltyStaker
                          ? formikProps.values.royaltyStaker > 0
                            ? t('auth:invalidPassphrase')
                            : t('form:required')
                          : ''
                      }
                      showError={formikProps.touched.royaltyStaker}
                      onChangeText={formikProps.handleChange('royaltyStaker')}
                      onSubmitEditing={() => passwordInput.current?.focus()}
                      blurOnSubmit={true}
                      returnKeyType="go"
                    />
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
    headerImage: {
      fontSize: wp('20%', insets),
      alignSelf: 'center',
    },
    passphraseInput: {
      height: hp('20%', insets),
    },
    passwordView: {
      flex: 0,
    },
    passwordInput: {
      marginBottom: hp('1%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    listIcon: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
  });
