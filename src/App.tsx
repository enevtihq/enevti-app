import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import queue from 'react-native-job-queue';

import AppNavigationContainer from './navigation';
import { persistor, store } from './store/state';
import { getTheme } from './theme';
import { IconProvider } from './components/atoms/icon/AppIconComponent';
import { cleanVoipNotificationHandler, setupCall, setupVoipNotificationHandler } from './service/call/device';
import './translations/i18n';
import './utils/debug/suppressWarning';

const App = () => {
  const colorScheme = useColorScheme();

  useEffect(() => SplashScreen.hide(), []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      const jobs = await queue.getJobs();
      if (state.isConnected && jobs.filter(job => job.failed === '').length > 0) {
        await queue.start();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setupCall();
  }, []);

  useEffect(() => {
    setupVoipNotificationHandler();
    return () => {
      cleanVoipNotificationHandler();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider
            theme={getTheme(colorScheme ? colorScheme.toString() : 'light')}
            settings={{ icon: props => <IconProvider {...props} /> }}>
            <AppNavigationContainer />
          </PaperProvider>
        </PersistGate>
      </StoreProvider>
    </SafeAreaProvider>
  );
};

export default App;
