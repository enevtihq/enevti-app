import React from 'react';
import { StyleSheet, StatusBar, View, Text } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { Theme } from '../theme/default';
import AppHeaderWizard from '../components/molecules/AppHeaderWizard';
import { RootStackParamList } from '../navigation';
import { iconMap } from '../components/atoms/icon/AppIconComponent';
import AppIconGradient from '../components/molecules/AppIconGradient';
import AppPrimaryButton from '../components/atoms/button/AppPrimaryButton';
import AppView from '../components/atoms/view/AppView';
import AppCheckbox from '../components/atoms/form/AppCheckbox';
import { hp, wp, SafeAreaInsets } from '../utils/imageRatio';

type Props = StackScreenProps<RootStackParamList, 'AccountCreated'>;

export default function AccountCreated({ navigation }: Props) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);
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
              size={wp('25%', insets)}
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.headerImage}
            />
          }
          title={t('auth:confirmPasspraseHeader')}
          description={t('auth:confirmPassphraseBody')}
          style={styles.header}
        />

        <View style={styles.passphraseView}>
          <Text>anjay</Text>
        </View>

        <View style={styles.actionContainer}>
          <View style={{ height: hp('3%', insets) }} />

          <AppPrimaryButton
            onPress={() => handleFormSubmit()}
            loading={isLoading}
            disabled={!checked}
            style={styles.createAccount}>
            {t('auth:continue')}
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

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
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
      marginBottom: hp('2%', insets),
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
    },
    createAccount: {
      marginBottom: hp('2%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    header: {
      flex: 1,
      marginLeft: wp('3%', insets),
      marginRight: wp('3%', insets),
    },
    headerImage: {
      alignSelf: 'center',
    },
    passphraseView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: wp('7%', insets),
      paddingRight: wp('7%', insets),
    },
    passphraseBox: {},
  });
