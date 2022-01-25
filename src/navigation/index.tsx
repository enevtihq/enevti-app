import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { useColorScheme } from 'react-native';

import CreateAccount from '../screen/auth/CreateAccount';
import SetupLocalPassword from '../screen/auth/SetupLocalPassword';
import ConfirmPassphrase from '../screen/auth/ConfirmPassphrase';
import AccountCreated from '../screen/auth/AccountCreated';
import ImportPassphrase from '../screen/auth/ImportPassphrase';
import Login from '../screen/auth/Login';

import { getTheme } from '../theme';
import Home from '../screen/Home';
import { store } from '../store/state';
import { getAuthState } from '../store/slices/auth';

export type RootStackParamList = {
  CreateAccount: undefined;
  SetupLocalPassword: undefined;
  ConfirmPassphrase: {
    passphrase: string;
    encryptedPassphrase: string;
    localKey: string;
  };
  AccountCreated: undefined;
  ImportPassphrase: undefined;
  Login: undefined;
  Home: undefined;
};

const Stack = createStackNavigator();

export default function AppNavigationContainer() {
  const colorScheme = useColorScheme();
  const auth = getAuthState(store.getState());
  const initialRoute = 'CreateAccount';
  // const initialRoute = auth.encrypted
  //   ? 'Login'
  //   : auth.token
  //   ? 'Home'
  //   : 'CreateAccount';

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
          name="ImportPassphrase"
          component={ImportPassphrase}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
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
