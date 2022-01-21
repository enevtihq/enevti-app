import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { StackScreenProps } from '@react-navigation/stack';

import { Theme } from '../theme/default';
import AppHeaderWizard from '../components/molecules/AppHeaderWizard';
import { RootStackParamList } from '../navigation';
import { iconMap } from '../components/atoms/icon/AppIconComponent';
import AppIconGradient from '../components/molecules/AppIconGradient';
import AppPrimaryButton from '../components/atoms/button/AppPrimaryButton';
import AppView from '../components/atoms/view/AppView';
import AppCheckbox from '../components/atoms/form/AppCheckbox';
import AppPassphraseBox from '../components/organism/AppPassphraseBox';

type Props = StackScreenProps<RootStackParamList, 'ConfirmPassphrase'>;

export default function ConfirmPassphrase({ route, navigation }: Props) {
  const { passphrase, encryptedPassphrase } = route.params;
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme);
  const { t } = useTranslation();
  const [checked, setChecked] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleFormSubmit = async () => {
    setIsLoading(false);
  };

  return (
    <AppView>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={theme.dark === true ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />

        <AppHeaderWizard
          navigation={navigation}
          image={
            <AppIconGradient
              name={iconMap.lock}
              size={wp('25%')}
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.headerImage}
            />
          }
          title={t('auth:confirmPasspraseHeader')}
          description={t('auth:confirmPassphraseBody')}
          style={styles.header}
        />

        <View style={styles.passphraseView}>
          <AppPassphraseBox
            passphrase={passphrase}
            style={styles.passphraseBox}
            onPress={() => console.log('anjay')}
          />
        </View>

        <View style={styles.actionContainer}>
          <View style={{ height: hp('3%') }} />

          <AppPrimaryButton
            onPress={() => handleFormSubmit()}
            loading={isLoading}
            disabled={!checked}
            style={styles.createAccount}>
            {t('auth:createAcc')}
          </AppPrimaryButton>

          <AppCheckbox
            value={checked}
            style={styles.checkbox}
            onPress={() => setChecked(!checked)}>
            {t('auth:confirmPassphraseCheck')}
          </AppCheckbox>
        </View>
      </SafeAreaView>
    </AppView>
  );
}

const makeStyle = (theme: Theme) =>
  StyleSheet.create({
    actionContainer: {
      flex: 0.7,
      flexDirection: 'column-reverse',
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    checkbox: {
      marginBottom: hp('2%'),
      marginLeft: wp('3%'),
      marginRight: wp('3%'),
    },
    createAccount: {
      marginBottom: hp('2%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
    header: {
      flex: 1,
      marginLeft: wp('3%'),
      marginRight: wp('3%'),
    },
    headerImage: {
      alignSelf: 'center',
    },
    passphraseView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: wp('7%'),
      paddingRight: wp('7%'),
    },
    passphraseBox: {},
  });
