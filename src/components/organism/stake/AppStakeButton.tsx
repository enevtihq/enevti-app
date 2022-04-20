import { View, Keyboard, StyleSheet } from 'react-native';
import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppFloatingActionButton from 'enevti-app/components/atoms/view/AppFloatingActionButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { Persona } from 'enevti-app/types/core/account/persona';
import { useTranslation } from 'react-i18next';
import AppCoinChipsPicker from 'enevti-app/components/organism/AppCoinChipsPicker';
import AppMenuFormTextInputWithError from 'enevti-app/components/molecules/menu/AppMenuFormTextInputWithError';
import { useTheme } from 'react-native-paper';
import i18n from 'enevti-app/translations/i18n';
import { StakeForm } from 'enevti-app/types/ui/store/StakeForm';
import { payAddStake } from 'enevti-app/store/middleware/thunk/payment/creator/payAddStake';
import { COIN_NAME } from 'enevti-app/components/atoms/brand/AppBrandConstant';
import { completeTokenUnit } from 'enevti-app/utils/format/amount';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';

const validationSchema = Yup.object().shape({
  stake: Yup.string().required(i18n.t('form:required')),
});

const initialValues: StakeForm = {
  stake: '',
};

interface AppStakeButtonProps {
  persona: Persona;
  visible: boolean;
  extended: boolean;
  onPress?: () => void;
  onModalDismiss?: () => void;
  onModalSubmit?: (values: StakeForm) => void;
}

export default function AppStakeButton({
  persona,
  visible,
  extended,
  onPress,
  onModalDismiss,
  onModalSubmit,
}: AppStakeButtonProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const snapPoints = React.useMemo(() => ['62%'], []);

  const [activePrice, setActivePrice] = React.useState<boolean>(false);
  const paymentThunkRef = React.useRef<any>();

  const myPersona = useSelector(selectMyPersonaCache);
  const selfStake = persona.address === myPersona.address;

  const onStakeSubmit = React.useCallback(
    (values: StakeForm) => {
      onModalSubmit && onModalSubmit(values);
      paymentThunkRef.current = dispatch(
        payAddStake({
          persona,
          stake: {
            amount: completeTokenUnit(values.stake),
            currency: COIN_NAME,
          },
        }),
      );
    },
    [onModalSubmit, dispatch, persona],
  );

  const paymentIdleCallback = React.useCallback(() => {
    paymentThunkRef.current?.abort();
  }, []);

  usePaymentCallback({
    onIdle: paymentIdleCallback,
  });

  return (
    <AppMenuContainer
      dismissKeyboard
      visible={visible}
      onDismiss={() => {
        setActivePrice(false);
        onModalDismiss && onModalDismiss();
      }}
      snapPoints={snapPoints}
      anchor={
        <AppFloatingActionButton
          label={selfStake ? t('stake:selfStake') : t('stake:addStake')}
          icon={iconMap.add}
          extended={extended}
          onPress={onPress}
        />
      }>
      <Formik
        initialValues={initialValues}
        onSubmit={async values => {
          Keyboard.dismiss();
          await onStakeSubmit(values);
        }}
        validationSchema={validationSchema}>
        {({
          handleChange,
          handleSubmit,
          setFieldTouched,
          values,
          errors,
          isValid,
          dirty,
          touched,
        }) => (
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
                rowEndComponent={
                  <AppCoinChipsPicker
                    active={activePrice}
                    error={touched.stake && !!errors.stake}
                  />
                }
                theme={theme}
                onChangeText={handleChange('stake')}
                value={values.stake}
                returnKeyType={'done'}
                autoComplete={'off'}
                autoCorrect={false}
                label={t('stake:addStakePlaceholder')}
                onBlur={() => {
                  setActivePrice(false);
                  setFieldTouched('stake');
                }}
                errorText={errors.stake}
                error={touched.stake && !!errors.stake}
                showError={touched.stake}
                blurOnSubmit={true}
                onSubmitEditing={isValid && dirty ? handleSubmit : () => {}}
                onFocus={() => setActivePrice(true)}
                keyboardType={'number-pad'}
              />
            </View>
            <View style={styles.dialogAction}>
              <AppPrimaryButton
                onPress={handleSubmit}
                disabled={!(isValid && dirty)}
                style={styles.dialogButton}>
                {selfStake ? t('stake:selfStake') : t('stake:addStake')}
              </AppPrimaryButton>
            </View>
          </View>
        )}
      </Formik>
    </AppMenuContainer>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    modalBox: {
      height: '100%',
      paddingBottom: insets.bottom,
    },
    googleSignInButton: {
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    dialogAction: {
      width: '100%',
      paddingHorizontal: wp('5%', insets),
    },
    dialogButton: {
      width: '100%',
      marginBottom: hp('3%', insets),
    },
    dialogContent: {
      width: '100%',
      paddingLeft: wp('5%', insets),
      paddingRight: wp('5%', insets),
      marginBottom: hp('2%', insets),
      flex: 1,
    },
    modalHeader: {
      width: wp('85%', insets),
      marginTop: hp('2%', insets),
      marginBottom: hp('3%', insets),
      alignSelf: 'center',
      flex: 0,
    },
  });
