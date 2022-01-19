import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { Theme } from '../theme/default';
import AppHeaderWizard from '../components/molecules/AppHeaderWizard';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { iconMap } from '../components/atoms/AppIconComponent';
import AppIconGradient from '../components/molecules/AppIconGradient';

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
    </SafeAreaView>
  );
}

const makeStyle = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      marginLeft: wp('3%'),
      marginRight: wp('3%'),
    },
    headerImage: {
      alignSelf: 'center',
    },
  });
