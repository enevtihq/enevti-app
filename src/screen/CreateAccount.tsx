import React from 'react';
import { View, Text } from 'react-native';
import { Caption, useTheme } from 'react-native-paper';

export default function CreateAccount() {
  const theme = useTheme();

  return (
    <View>
      <Text>Create Account Screens</Text>
      <Caption>{JSON.stringify(theme.colors)}</Caption>
    </View>
  );
}
