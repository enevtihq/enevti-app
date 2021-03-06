import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, useColorScheme } from 'react-native';

import CreateAccount from 'enevti-app/screen/auth/CreateAccount';
import SetupLocalPassword from 'enevti-app/screen/auth/SetupLocalPassword';
import ConfirmPassphrase from 'enevti-app/screen/auth/ConfirmPassphrase';
import AccountCreated from 'enevti-app/screen/auth/AccountCreated';
import ImportPassphrase from 'enevti-app/screen/auth/ImportPassphrase';
import Login from 'enevti-app/screen/auth/Login';
import Home from '../screen/home/Home';
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
import { EncryptedData } from 'enevti-app/types/core/service/cryptography';
import { linking } from 'enevti-app/utils/linking';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import SetupUsername from 'enevti-app/screen/setting/SetupUsername';
import UsernameRegistered from 'enevti-app/screen/setting/UsernameRegistered';
import QRScanner from 'enevti-app/screen/qr/QRScanner';
import { selectLocalSession } from 'enevti-app/store/slices/session/local';
import Wallet from 'enevti-app/screen/wallet/Wallet';
import ReceiveToken from 'enevti-app/screen/wallet/ReceiveToken';
import SendToken from 'enevti-app/screen/wallet/SendToken';
import { onNotificationForegroundHandler } from 'enevti-app/utils/notification/events';
import notifee from '@notifee/react-native';
import { Socket } from 'socket.io-client';
import { appSocket } from 'enevti-app/utils/network';
import { reduceNewBlock } from 'enevti-app/store/middleware/thunk/socket/chain/newBlock';
import Comment from 'enevti-app/screen/explorer/Comment';

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
  Login: { path?: string };
  Home: undefined;
  Feed: undefined;
  MyProfile: undefined;
  ChooseNFTType: undefined;
  SetupUsername: undefined;
  QRScanner: {
    successEvent: string;
    failedEvent?: string;
    focusEvent?: string;
    blurEvent?: string;
    fullscreen?: boolean;
  };
  UsernameRegistered: { username: string };
  ChooseNFTTemplate: {
    mode: 'normal' | 'change';
  };
  CreateOneKindContract: {
    normal?: boolean;
  };
  Profile: {
    arg: string;
    mode: 'a' | 'b' | 'u';
  };
  StakePool: {
    arg: string;
    mode: 'a' | 'b' | 'u';
  };
  Wallet: {
    arg: string;
    mode: 'a' | 'b' | 'u';
  };
  ReceiveToken: undefined;
  SendToken: {
    base32?: string;
    amount?: string;
  };
  Collection: {
    arg: string;
    mode: 'id' | 's';
  };
  NFTDetails: {
    arg: string;
    mode: 'id' | 's';
  };
  Comment: {
    type: 'nft' | 'collection';
    arg: string;
    mode: 'id' | 's';
  };
};

const Stack = createStackNavigator();

export default function AppNavigationContainer() {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const locked = useSelector(selectLockedState);
  const localSession = useSelector(selectLocalSession);
  const currentRoute = navigationRef.isReady() ? navigationRef.getCurrentRoute()?.name : undefined;
  const socket = React.useRef<Socket | undefined>();

  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  const LinkingFallback = React.useMemo(
    () => <AppActivityIndicator style={styles.fallbackLoading} />,
    [styles.fallbackLoading],
  );

  const auth = useSelector(selectAuthState);
  const initialRoute = auth.encrypted ? 'Login' : auth.token ? 'Home' : 'CreateAccount';
  const navLinking = React.useMemo(() => linking(initialRoute, currentRoute), [initialRoute, currentRoute]);

  useLockScreen();
  useScreenDisplayed();

  React.useEffect(() => {
    if (auth.encrypted && localSession.key === '' && locked && currentRoute !== 'Login') {
      navigationRef.navigate('Login', {});
    }
  }, [auth.encrypted, locked, navigationRef, currentRoute, localSession.key]);

  React.useEffect(() => {
    return notifee.onForegroundEvent(async ({ type, detail }) => {
      await onNotificationForegroundHandler(type, detail);
    });
  }, []);

  React.useEffect(() => {
    socket.current = appSocket('chain');
    socket.current.on('newBlock', (payload: any) => dispatch(reduceNewBlock(payload)));
    return function cleanup() {
      socket.current?.disconnect();
    };
  }, [dispatch]);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={navLinking}
      fallback={LinkingFallback}
      theme={getTheme(colorScheme!.toString())}>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ gestureEnabled: false }}>
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
        <Stack.Screen
          name="SetupUsername"
          component={SetupUsername}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="UsernameRegistered"
          component={UsernameRegistered}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="QRScanner"
          component={QRScanner}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}
        />
        <Stack.Screen
          name="Wallet"
          component={Wallet}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="ReceiveToken"
          component={ReceiveToken}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="SendToken"
          component={SendToken}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="Comment"
          component={Comment}
          options={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    fallbackLoading: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      flex: 1,
    },
  });
