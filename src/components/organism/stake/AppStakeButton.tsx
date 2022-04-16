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
import { useSelector } from 'react-redux';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { Persona } from 'enevti-app/types/service/enevti/persona';
import { useTranslation } from 'react-i18next';
import AppCoinChipsPicker from 'enevti-app/components/organism/AppCoinChipsPicker';
import AppFormTextInputWithError from 'enevti-app/components/molecules/AppFormTextInputWithError';
import { useTheme } from 'react-native-paper';

const validationSchema = Yup.object().shape({
  stake: Yup.number().positive().required(),
});

const initialValues = {
  stake: '',
};

type StakeForm = typeof initialValues;

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
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const snapPoints = React.useMemo(() => ['62%'], []);

  const [activePrice, setActivePrice] = React.useState<boolean>(false);
  const myPersona = useSelector(selectMyPersonaCache);
  const selfStake = persona.address === myPersona.address;

  const onStakeSubmit = React.useCallback(
    (values: StakeForm) => {
      onModalSubmit && onModalSubmit(values);
    },
    [onModalSubmit],
  );

  return (
    <AppMenuContainer
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
              <AppFormTextInputWithError
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
