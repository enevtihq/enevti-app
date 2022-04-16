import { View, Keyboard, StyleSheet } from 'react-native';
import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppFloatingActionButton from 'enevti-app/components/atoms/view/AppFloatingActionButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import AppFormSecureTextInput from 'enevti-app/components/organism/AppFormSecureTextInput';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { Persona } from 'enevti-app/types/service/enevti/persona';
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object().shape({
  stake: Yup.number().positive().required(),
});

interface AppStakeButtonProps {
  persona: Persona;
  visible: boolean;
  extended: boolean;
  onPress: () => void;
  onModalDismiss: () => void;
}

export default function AppStakeButton({
  persona,
  visible,
  extended,
  onPress,
  onModalDismiss,
}: AppStakeButtonProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const snapPoints = React.useMemo(() => ['62%'], []);

  const myPersona = useSelector(selectMyPersonaCache);
  const selfStake = persona.address === myPersona.address;

  const onStakeSubmit = React.useCallback((values: { stake: string }) => {
    console.log(values);
  }, []);

  return (
    <AppMenuContainer
      visible={visible}
      onDismiss={onModalDismiss}
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
        initialValues={{
          stake: '',
        }}
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
              modeData={'passphrase'}
              style={styles.modalHeader}
              title={t('auth:inputBinderPassword')}
              description={t('auth:inputBinderPasswordBody')}
            />
            <View style={styles.dialogContent}>
              <AppFormSecureTextInput
                label={t('auth:yourBinderPassword')}
                value={values.stake}
                errorText={errors.stake}
                showError={touched.stake}
                touchHandler={() => setFieldTouched('stake')}
                onChangeText={handleChange('stake')}
                onSubmitEditing={isValid && dirty ? handleSubmit : () => {}}
                blurOnSubmit={true}
                returnKeyType={'done'}
              />
            </View>
            <View style={styles.dialogAction}>
              <AppPrimaryButton
                onPress={handleSubmit}
                disabled={!(isValid && dirty)}
                style={styles.dialogButton}>
                {t('auth:loginButton')}
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
