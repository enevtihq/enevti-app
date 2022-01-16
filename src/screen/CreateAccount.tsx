import React from 'react';
import { View, Text } from 'react-native';
import { Caption, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function CreateAccount() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View>
      <Text>Create Account Screensx</Text>
      <Caption>{JSON.stringify(theme.colors)}</Caption>
      <Caption>{t('auth:string1')}</Caption>
    </View>
  );
}
