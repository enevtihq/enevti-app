import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { Theme } from 'enevti-app/theme/default';
import AppBrandBanner from 'enevti-app/components/molecules/AppBrandBanner';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
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
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const { t } = useTranslation();

  return (
    <AppView withModal>
      <AppHeaderWizard
        component={
          <AppBrandBanner widthPercentage={0.5} style={styles.headerImage} />
        }
        title={t('auth:header1')}
        description={t('auth:body1')}
      />

      <View style={styles.actionContainer}>
        <View style={{ height: hp('3%', insets) }} />
        <AppTextBody5 style={styles.term}>{t('auth:term')}</AppTextBody5>
        <View style={{ height: hp('6%', insets) }} />

        <AppSecondaryButton
          onPress={() => navigation.navigate('ImportPassphrase')}
          style={styles.createAccount}>
          {t('auth:importPassphrase')}
        </AppSecondaryButton>

        <View style={{ height: hp('2%', insets) }} />

        <AppPrimaryButton
          onPress={() => navigation.navigate('SetupLocalPassword')}
          style={styles.createAccount}>
          {t('auth:createAccount')}
        </AppPrimaryButton>

        <View style={styles.orView}>
          <View style={styles.orLine} />
          <AppTextBody4
            style={{
              color: theme.colors.placeholder,
              marginBottom: hp('2%', insets),
            }}>
            {t('auth:or')}
          </AppTextBody4>
          <View style={styles.orLine} />
        </View>

        <View style={{ height: hp('2%', insets) }} />

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

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    actionContainer: {
      flex: 1,
      flexDirection: 'column-reverse',
    },
    createAccount: {
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    headerImage: {
      alignSelf: 'center',
    },
    orLine: {
      backgroundColor: theme.colors.placeholder,
      height: 1,
      width: wp('7%', insets),
      alignSelf: 'center',
      marginLeft: wp('2%', insets),
      marginRight: wp('2%', insets),
      marginBottom: hp('2%', insets),
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
