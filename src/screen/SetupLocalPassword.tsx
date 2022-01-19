import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { Theme } from '../theme/default';
import AppHeaderWizard from '../components/molecules/AppHeaderWizard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { iconMap } from '../components/atoms/icon/AppIconComponent';
import AppIconGradient from '../components/molecules/AppIconGradient';
import AppFormSecureTextInput from '../components/molecules/AppFormSecureTextInput';
import AppPrimaryButton from '../components/atoms/button/AppPrimaryButton';

type Props = StackScreenProps<RootStackParamList, 'SetupLocalPassword'>;

export default function SetupLocalPassword({ navigation }: Props) {
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme);
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.dark === true ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <AppHeaderWizard
        back
        navigation={navigation}
        image={
          <AppIconGradient
            name={iconMap.key}
            size={wp('25%')}
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.headerImage}
          />
        }
        title={t('auth:localPasswordHeader')}
        description={t('auth:localPasswordBody')}
        style={styles.header}
      />

      <View style={styles.passwordView}>
        <AppFormSecureTextInput
          label={t('auth:newLocalPassword')}
          style={styles.passwordInput}
        />
        <AppFormSecureTextInput
          label={t('auth:confirmLocalPassword')}
          style={styles.passwordInput}
        />
      </View>

      <View style={styles.actionContainer}>
        <View style={{ height: hp('3%') }} />

        <AppPrimaryButton
          onPress={() => console.log('anjay')}
          style={styles.createAccount}>
          {t('auth:createAcc')}
        </AppPrimaryButton>
      </View>
    </SafeAreaView>
  );
}

const makeStyle = (theme: Theme) =>
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
      marginBottom: hp('2%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
    header: {
      marginLeft: wp('3%'),
      marginRight: wp('3%'),
    },
    headerImage: {
      alignSelf: 'center',
    },
    passwordView: {
      flex: 1,
    },
    passwordInput: {
      marginBottom: hp('2%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
  });
