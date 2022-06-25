import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { RootStackParamList } from 'enevti-app/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { getCoinName } from 'enevti-app/utils/constant/identifier';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AppFormTextInputWithError from 'enevti-app/components/molecules/AppFormTextInputWithError';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { parseAmount } from 'enevti-app/utils/format/amount';
import i18n from 'enevti-app/translations/i18n';
import { useDispatch } from 'react-redux';
import { payTransferToken } from 'enevti-app/store/middleware/thunk/payment/creator/payTransferToken';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import AppAddressPicker from 'enevti-app/components/organism/wallet/AppAddressPicker';
import { Persona } from 'enevti-app/types/core/account/persona';
import { base32ToAddress, getBasePersona } from 'enevti-app/service/enevti/persona';

type Props = StackScreenProps<RootStackParamList, 'SendToken'>;

const validationSchema = Yup.object().shape({
  base32: Yup.string().required(i18n.t('form:required')),
  amount: Yup.number()
    .typeError(i18n.t('form:invalidNumber'))
    .moreThan(-1, i18n.t('wallet:amountMustBePositive'))
    .required(i18n.t('form:required')),
});

export default function SendToken({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const paperTheme = useTheme();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const paymentThunkRef = React.useRef<any>();

  const [persona, setPersona] = React.useState<Persona>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loadingPersona, setLoadingPersona] = React.useState<boolean>(false);

  const onLoad = React.useCallback(
    (
        setFieldValue: (key: string, value: string, shouldValidate: boolean) => void,
        setFieldTouched: (key: string, isTouched: boolean, shouldValidate: boolean) => void,
      ) =>
      async () => {
        if (route.params.amount) {
          setFieldTouched('amount', true, false);
          setFieldValue('amount', parseAmount(route.params.amount), false);
        }
        if (route.params.base32) {
          setLoadingPersona(true);
          const parsedPersona = await getBasePersona(base32ToAddress(route.params.base32));
          if (parsedPersona.status) {
            setPersona(parsedPersona.data);
            setLoadingPersona(false);
          }
          setFieldTouched('base32', true, false);
          setFieldValue('base32', route.params.base32, false);
        }
      },
    [route.params.amount, route.params.base32],
  );

  const paymentIdleCallback = React.useCallback(() => {
    setIsLoading(false);
    paymentThunkRef.current?.abort();
  }, []);

  const paymentSuccessCallback = React.useCallback(() => {
    navigation.goBack();
    dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
  }, [dispatch, navigation, t]);

  usePaymentCallback({
    onIdle: paymentIdleCallback,
    onSuccess: paymentSuccessCallback,
  });

  const onPersonaSelected = React.useCallback(
    (setFieldValue: (key: string, value: string, shouldValidate: boolean) => void) => (data: Persona) => {
      setFieldValue('base32', data.base32, true);
      setPersona(data);
    },
    [],
  );

  const handleFormSubmit = React.useCallback(
    (values: { base32: string; amount: string }) => {
      dispatch(payTransferToken(values));
    },
    [dispatch],
  );

  return (
    <AppView
      dismissKeyboard
      withLoader
      withPayment
      withModal
      edges={['left', 'bottom', 'right']}
      header={<AppHeader back navigation={navigation} title={' '} />}>
      <AppHeaderWizard
        noHeaderSpace
        mode={'icon'}
        modeData={'transfer'}
        navigation={navigation}
        title={t('wallet:sendCoin', { coin: getCoinName() })}
        description={t('wallet:sendCoinDescription')}
        style={styles.header}
      />
      <Formik
        initialValues={{
          base32: '',
          amount: '',
        }}
        onSubmit={async values => {
          setIsLoading(true);
          await handleFormSubmit(values);
        }}
        validationSchema={validationSchema}>
        {({
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          submitForm,
          values,
          errors,
          isValid,
          dirty,
          touched,
        }) => (
          <>
            <View onLayout={onLoad(setFieldValue, setFieldTouched)} style={styles.inputView}>
              <AppAddressPicker
                loading={loadingPersona}
                value={persona}
                onSelected={onPersonaSelected(setFieldValue)}
              />
              <View style={{ height: hp(2, insets) }} />
              <AppFormTextInputWithError
                theme={paperTheme}
                label={t('wallet:amount')}
                placeholder={t('wallet:amountDescription', { currency: getCoinName() })}
                style={styles.formInput}
                value={values.amount}
                errorText={errors.amount}
                showError={touched.amount}
                onBlur={handleBlur('amount')}
                onChangeText={handleChange('amount')}
                onSubmitEditing={() => {}}
                blurOnSubmit={true}
                keyboardType={'number-pad'}
                autoComplete={'off'}
                autoCorrect={false}
                returnKeyType="go"
              />
            </View>

            <View style={styles.actionContainer}>
              <View style={{ height: hp('3%', insets) }} />

              <AppPrimaryButton
                onPress={submitForm}
                loading={isLoading}
                disabled={!(isValid && dirty)}
                style={styles.sendButton}>
                {t('wallet:sendToken')}
              </AppPrimaryButton>
            </View>
          </>
        )}
      </Formik>
    </AppView>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    brandLogo: {
      alignSelf: 'center',
      justifyContent: 'center',
      marginBottom: hp('2%', insets),
    },
    header: {
      flex: 0,
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
      marginBottom: hp('5%', insets),
    },
    formInput: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    inputView: {
      flex: 1,
    },
    actionContainer: {
      flex: 0.8,
      flexDirection: 'column-reverse',
    },
    sendButton: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
