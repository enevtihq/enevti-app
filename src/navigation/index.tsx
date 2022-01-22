import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import CreateAccount from '../screen/auth/CreateAccount';
import SetupLocalPassword from '../screen/auth/SetupLocalPassword';
import ConfirmPassphrase from '../screen/auth/ConfirmPassphrase';
import AccountCreated from '../screen/auth/AccountCreated';
import { useColorScheme } from 'react-native';
import { getTheme } from '../theme';
import Home from '../screen/Home';
import { RootState } from '../store/state';

export type RootStackParamList = {
  CreateAccount: undefined;
  SetupLocalPassword: undefined;
  ConfirmPassphrase: { passphrase: string; encryptedPassphrase: string };
  AccountCreated: undefined;
  Home: undefined;
};

const Stack = createStackNavigator();

export default function AppNavigationContainer() {
  const colorScheme = useColorScheme();
  const auth = useSelector((state: RootState) => state.auth);
  const initialRoute = auth.token ? 'Home' : 'CreateAccount';

  return (
    <NavigationContainer theme={getTheme(colorScheme!.toString())}>
      <Stack.Navigator initialRouteName={initialRoute}>
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
        <Stack.Screen
          name="ConfirmPassphrase"
          component={ConfirmPassphrase}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="AccountCreated"
          component={AccountCreated}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
