import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { useColorScheme } from 'react-native';

import CreateAccount from 'enevti-app/screen/auth/CreateAccount';
import SetupLocalPassword from 'enevti-app/screen/auth/SetupLocalPassword';
import ConfirmPassphrase from 'enevti-app/screen/auth/ConfirmPassphrase';
import AccountCreated from 'enevti-app/screen/auth/AccountCreated';
import ImportPassphrase from 'enevti-app/screen/auth/ImportPassphrase';
import Login from 'enevti-app/screen/auth/Login';
import Home from './Home';
import StakePool from 'enevti-app/screen/stake/StakePool';
import Profile from 'enevti-app/screen/profile/Profile';
import ChooseNFTType from 'enevti-app/screen/createNFT/ChooseNFTType';
import ChooseNFTTemplate from 'enevti-app/screen/createNFT/ChooseNFTTemplate';
import CreateOneKindContract from 'enevti-app/screen/createNFT/CreateOneKindContract';
import Collection from 'enevti-app/screen/collection/Collection';

import { getTheme } from 'enevti-app/theme';
import { selectAuthState } from 'enevti-app/store/slices/auth';
import SetupGoogleBinderPassword from 'enevti-app/screen/auth/SetupGoogleBinderPassword';
import useLockScreen from 'enevti-app/utils/hook/useLockScreen';
import useScreenDisplayed from 'enevti-app/utils/hook/useScreenDisplayed';
import { selectLockedState } from 'enevti-app/store/slices/ui/screen/locked';
import NFTDetails from 'enevti-app/screen/nftDetails/NFTDetails';
import { EncryptedData } from 'enevti-app/types/utils/cryptography';

export type RootStackParamList = {
  CreateAccount: undefined;
  SetupLocalPassword: undefined;
  SetupGoogleBinderPassword: undefined;
  ConfirmPassphrase: {
    passphrase: string;
    encryptedPassphrase: EncryptedData;
    localKey: string;
  };
  AccountCreated: undefined;
  ImportPassphrase: undefined;
  Login: undefined;
  Home: undefined;
  Feed: undefined;
  MyProfile: undefined;
  Profile: {
    address: string;
  };
  StakePool: {
    address: string;
  };
  ChooseNFTType: undefined;
  ChooseNFTTemplate: {
    mode: 'normal' | 'change';
  };
  CreateOneKindContract: {
    normal?: boolean;
  };
  Collection: {
    id: string;
  };
  NFTDetails: {
    id: string;
  };
};

const Stack = createStackNavigator();

export default function AppNavigationContainer() {
  const colorScheme = useColorScheme();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const locked = useSelector(selectLockedState);

  const auth = useSelector(selectAuthState);
  const initialRoute = auth.encrypted
    ? 'Login'
    : auth.token
    ? 'Home'
    : 'CreateAccount';

  useLockScreen();
  useScreenDisplayed();

  React.useEffect(() => {
    if (
      auth.encrypted &&
      locked &&
      navigationRef.getCurrentRoute()?.name !== 'Login'
    ) {
      navigationRef.navigate('Login');
    }
  }, [auth.encrypted, locked, navigationRef]);

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={getTheme(colorScheme!.toString())}>
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
          name="Profile"
          component={Profile}
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
        <Stack.Screen
          name="Collection"
          component={Collection}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="NFTDetails"
          component={NFTDetails}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
