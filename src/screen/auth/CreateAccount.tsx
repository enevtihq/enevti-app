import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { Theme } from '../../theme/default';
import AppBrandBanner from '../../components/molecules/AppBrandBanner';
import AppHeaderWizard from '../../components/molecules/AppHeaderWizard';
import AppTextBody4 from '../../components/atoms/text/AppTextBody4';
import { hp, wp, SafeAreaInsets } from '../../utils/imageRatio';
import AppPrimaryButton from '../../components/atoms/button/AppPrimaryButton';
import AppSecondaryButton from '../../components/atoms/button/AppSecondaryButton';
import AppTextBody3 from '../../components/atoms/text/AppTextBody3';
import { RootStackParamList } from '../../navigation';
import AppView from '../../components/atoms/view/AppView';
import AppGoogleSignInButton from '../../components/organism/AppGoogleSignInButton';
import { CommonActions } from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'CreateAccount'>;

export default function CreateAccount({ navigation }: Props) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);
  const { t } = useTranslation();

  return (
    <AppView>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={theme.dark === true ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />

        <AppHeaderWizard
          image={
            <AppBrandBanner widthPercentage={0.5} style={styles.headerImage} />
          }
          title={t('auth:header1')}
          description={t('auth:body1')}
        />

        <View style={styles.actionContainer}>
          <View style={{ height: hp('3%', insets) }} />
          <AppTextBody4 style={styles.term}>{t('auth:term')}</AppTextBody4>
          <View style={{ height: hp('4%', insets) }} />

          <AppSecondaryButton
            onPress={() => navigation.navigate('ImportPassphrase')}
            style={styles.createAccount}>
            {t('auth:importPassphrase')}
          </AppSecondaryButton>

          <AppPrimaryButton
            onPress={() => navigation.navigate('SetupLocalPassword')}
            style={styles.createAccount}>
            {t('auth:createAccount')}
          </AppPrimaryButton>

          <View style={styles.orView}>
            <View style={styles.orLine} />
            <AppTextBody3
              style={{
                color: theme.colors.placeholder,
                marginBottom: hp('2%', insets),
              }}>
              {t('auth:or')}
            </AppTextBody3>
            <View style={styles.orLine} />
          </View>

          <AppGoogleSignInButton
            onExistingAccount={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'AccountCreated' }],
                }),
              );
            }}
            onNewAccount={() =>
              navigation.navigate('SetupGoogleBinderPassword')
            }
          />
        </View>
      </SafeAreaView>
    </AppView>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    actionContainer: {
      flex: 1,
      flexDirection: 'column-reverse',
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    createAccount: {
      marginBottom: hp('2%', insets),
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