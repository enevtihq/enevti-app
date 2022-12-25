import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppFloatingActionButton from 'enevti-app/components/atoms/view/AppFloatingActionButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { Persona } from 'enevti-app/types/core/account/persona';
import { useTranslation } from 'react-i18next';
import AppCoinChipsPicker from 'enevti-app/components/organism/coin/AppCoinChipsPicker';
import AppMenuFormTextInputWithError from 'enevti-app/components/molecules/menu/AppMenuFormTextInputWithError';
import { TextInput, useTheme } from 'react-native-paper';
import i18n from 'enevti-app/translations/i18n';
import { StakeForm } from 'enevti-app/types/ui/store/StakeForm';
import { payAddStake } from 'enevti-app/store/middleware/thunk/payment/creator/payAddStake';
import { COIN_NAME } from 'enevti-app/utils/constant/identifier';
import { completeTokenUnit } from 'enevti-app/utils/format/amount';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import YupMultipleOf10 from 'enevti-app/utils/yup/number/multipleOf10';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';

YupMultipleOf10(Yup);

const validationSchema = Yup.object().shape({
  stake: Yup.number().multipleOf10().required(i18n.t('form:required')),
});

const initialValues: StakeForm = {
  stake: '',
};

interface AppStakeButtonProps {
  persona: Persona;
  extended: boolean;
  route: RouteProp<RootStackParamList, 'StakePool'>;
}

export default function AppStakeButton({ persona, extended, route }: AppStakeButtonProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const snapPoints = React.useMemo(() => ['62%'], []);
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  const paymentThunkRef = React.useRef<any>();

  const myPersona = useSelector(selectMyPersonaCache);
  const selfStake = persona.address === myPersona.address;

  const onStakeButtonDismiss = React.useCallback(() => {
    setMenuVisible(false);
  }, []);

  const onStakeButtonPress = React.useCallback(async () => {
    setMenuVisible(!menuVisible);
  }, [menuVisible]);

  const onStakeSubmit = React.useCallback(
    (values: StakeForm) => {
      paymentThunkRef.current = dispatch(
        payAddStake({
          persona,
          key: route.key,
          stake: {
            amount: completeTokenUnit(values.stake),
            currency: COIN_NAME,
          },
        }),
      );
    },
    [dispatch, persona, route.key],
  );

  const onSubmit = React.useCallback(
    values => {
      onStakeButtonDismiss();
      onStakeSubmit(values);
    },
    [onStakeButtonDismiss, onStakeSubmit],
  );

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined &&
        ['addStake'].includes(paymentStatus.action) &&
        paymentStatus.key === route.key
      );
    },
    [route.key],
  );

  const paymentIdleCallback = React.useCallback(() => {
    paymentThunkRef.current?.abort();
  }, []);

  usePaymentCallback({
    condition: paymentCondition,
    onIdle: paymentIdleCallback,
  });

  return (
    <View>
      <AppFloatingActionButton
        label={selfStake ? t('stake:selfStake') : t('stake:addStake')}
        icon={iconMap.add}
        extended={extended}
        onPress={onStakeButtonPress}
      />
      {menuVisible ? (
        <AppMenuContainer dismissKeyboard visible={true} onDismiss={onStakeButtonDismiss} snapPoints={snapPoints}>
          <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            {({ handleChange, submitForm, setFieldTouched, values, errors, isValid, dirty, touched }) => (
              <View style={styles.modalBox}>
                <AppHeaderWizard
                  noHeaderSpace
                  mode={'icon'}
                  modeData={'stake'}
                  style={styles.modalHeader}
                  title={t('stake:addStakeTitle')}
                  description={t('stake:addStakeDescription')}
                />
                <View style={styles.dialogContent}>
                  <AppMenuFormTextInputWithError
                    hideMaxLengthIndicator
                    maxLength={13}
                    endComponent={<AppCoinChipsPicker />}
                    right={<TextInput.Icon name={iconMap.dropDown} />}
                    theme={theme}
                    onChangeText={handleChange('stake')}
                    value={values.stake}
                    returnKeyType={'done'}
                    autoComplete={'off'}
                    autoCorrect={false}
                    label={t('stake:addStakePlaceholder')}
                    onBlur={() => {
                      setFieldTouched('stake');
                    }}
                    errorText={errors.stake}
                    error={touched.stake && !!errors.stake}
                    showError={touched.stake}
                    blurOnSubmit={true}
                    keyboardType={'number-pad'}
                  />
                </View>
                <View style={styles.dialogAction}>
                  <AppPrimaryButton onPress={submitForm} disabled={!(isValid && dirty)} style={styles.dialogButton}>
                    {selfStake ? t('stake:selfStake') : t('stake:addStake')}
                  </AppPrimaryButton>
                  <View style={{ height: hp('3%') }} />
                </View>
              </View>
            )}
          </Formik>
        </AppMenuContainer>
      ) : null}
    </View>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    modalBox: {
      height: '100%',
      paddingBottom: insets.bottom,
    },
    googleSignInButton: {
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
    dialogAction: {
      width: '100%',
      paddingHorizontal: wp('5%'),
    },
    dialogButton: {
      width: '100%',
    },
    dialogContent: {
      width: '100%',
      paddingLeft: wp('5%'),
      paddingRight: wp('5%'),
      marginBottom: hp('2%'),
      flex: 1,
    },
    modalHeader: {
      width: wp('85%'),
      marginTop: hp('2%'),
      marginBottom: hp('3%'),
      alignSelf: 'center',
      flex: 0,
    },
  });
