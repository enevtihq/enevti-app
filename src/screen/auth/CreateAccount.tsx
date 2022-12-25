import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { Theme } from 'enevti-app/theme/default';
import AppBrandBanner from 'enevti-app/components/molecules/brand/AppBrandBanner';
import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppSecondaryButton from 'enevti-app/components/atoms/button/AppSecondaryButton';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { RootStackParamList } from 'enevti-app/navigation';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppGoogleSignInButton from 'enevti-app/components/organism/google/AppGoogleSignInButton';
import { CommonActions } from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'CreateAccount'>;

export default function CreateAccount({ navigation }: Props) {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  const { t } = useTranslation();

  return (
    <AppView withModal>
      <AppHeaderWizard
        component={<AppBrandBanner widthPercentage={0.5} style={styles.headerImage} />}
        title={t('auth:header1')}
        description={t('auth:body1')}
      />

      <View style={styles.actionContainer}>
        <View style={{ height: hp('3%') }} />
        <AppTextBody5 style={styles.term}>{t('auth:term')}</AppTextBody5>
        <View style={{ height: hp('6%') }} />

        <AppSecondaryButton onPress={() => navigation.navigate('ImportPassphrase')} style={styles.createAccount}>
          {t('auth:importPassphrase')}
        </AppSecondaryButton>

        <View style={{ height: hp('2%') }} />

        <AppPrimaryButton onPress={() => navigation.navigate('SetupLocalPassword')} style={styles.createAccount}>
          {t('auth:createAccount')}
        </AppPrimaryButton>

        <View style={styles.orView}>
          <View style={styles.orLine} />
          <AppTextBody4
            style={{
              color: theme.colors.placeholder,
              marginBottom: hp('2%'),
            }}>
            {t('auth:or')}
          </AppTextBody4>
          <View style={styles.orLine} />
        </View>

        <View style={{ height: hp('2%') }} />

        <AppGoogleSignInButton
          onExistingAccount={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'AccountCreated' }],
              }),
            );
          }}
          onNewAccount={() => navigation.navigate('SetupGoogleBinderPassword')}
        />
      </View>
    </AppView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    actionContainer: {
      flex: 1,
      flexDirection: 'column-reverse',
    },
    createAccount: {
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
    headerImage: {
      alignSelf: 'center',
    },
    orLine: {
      backgroundColor: theme.colors.placeholder,
      height: 1,
      width: wp('7%'),
      alignSelf: 'center',
      marginLeft: wp('2%'),
      marginRight: wp('2%'),
      marginBottom: hp('2%'),
    },
    orView: {
      flexDirection: 'row',
      alignSelf: 'center',
      margin: 8,
    },
    term: {
      alignSelf: 'center',
      color: theme.colors.placeholder,
    },
  });
