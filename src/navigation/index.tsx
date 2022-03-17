import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { useColorScheme } from 'react-native';

import CreateAccount from '../screen/auth/CreateAccount';
import SetupLocalPassword from '../screen/auth/SetupLocalPassword';
import ConfirmPassphrase from '../screen/auth/ConfirmPassphrase';
import AccountCreated from '../screen/auth/AccountCreated';
import ImportPassphrase from '../screen/auth/ImportPassphrase';
import Login from '../screen/auth/Login';

import { getTheme } from '../theme';
import { selectAuthState } from '../store/slices/auth';
import SetupGoogleBinderPassword from '../screen/auth/SetupGoogleBinderPassword';
import Home from './Home';
import StakePool from '../screen/stake/StakePool';
import { Persona } from '../types/service/enevti/persona';
import ChooseNFTType from '../screen/createNFT/ChooseNFTType';
import ChooseNFTTemplate from '../screen/createNFT/ChooseNFTTemplate';
import CreateOneKindContract from '../screen/createNFT/CreateOneKindContract';

export type RootStackParamList = {
  CreateAccount: undefined;
  SetupLocalPassword: undefined;
  SetupGoogleBinderPassword: undefined;
  ConfirmPassphrase: {
    passphrase: string;
    encryptedPassphrase: string;
    localKey: string;
  };
  AccountCreated: undefined;
  ImportPassphrase: undefined;
  Login: undefined;
  Home: undefined;
  Feed: undefined;
  MyProfile: undefined;
  StakePool: {
    persona: Persona;
  };
  ChooseNFTType: undefined;
  ChooseNFTTemplate: {
    mode: 'normal' | 'change';
  };
  CreateOneKindContract: undefined;
};

const Stack = createStackNavigator();

export default function AppNavigationContainer() {
  const colorScheme = useColorScheme();
  const auth = useSelector(selectAuthState);
  const initialRoute = auth.encrypted
    ? 'Login'
    : auth.token
    ? 'Home'
    : 'CreateAccount';

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
          name="SetupGoogleBinderPassword"
          component={SetupGoogleBinderPassword}
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
        <Stack.Screen
          name="StakePool"
          component={StakePool}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="ChooseNFTType"
          component={ChooseNFTType}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="ChooseNFTTemplate"
          component={ChooseNFTTemplate}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="CreateOneKindContract"
          component={CreateOneKindContract}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
