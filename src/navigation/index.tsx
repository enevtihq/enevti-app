import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import CreateAccount from '../screen/CreateAccount';
import { useColorScheme } from 'react-native';
import { getTheme } from '../theme';
import SetupLocalPassword from '../screen/SetupLocalPassword';

export type RootStackParamList = {
  CreateAccount: undefined;
  SetupLocalPassword: undefined;
};

const Stack = createStackNavigator();

export default function AppNavigationContainer() {
  const colorScheme = useColorScheme();
  return (
    <NavigationContainer theme={getTheme(colorScheme!.toString())}>
      <Stack.Navigator>
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccount}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="SetupLocalPassword"
          component={SetupLocalPassword}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
