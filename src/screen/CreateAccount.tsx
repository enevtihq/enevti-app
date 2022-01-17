import React from 'react';
import { Text, SafeAreaView, StyleSheet } from 'react-native';
import { Caption, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Theme } from '../theme/default';

export default function CreateAccount() {
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme);
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Create Account Screensx</Text>
      <Caption>{JSON.stringify(theme)}</Caption>
      <Caption>{t('auth:string1')}</Caption>
    </SafeAreaView>
  );
}

const makeStyle = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
