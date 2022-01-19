import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import AppNavigationContainer from './navigation';
import { persistor, store } from './store/state';
import { getTheme } from './theme';
import './translations/i18n';
import { IconProvider } from './components/atoms/icon/AppIconComponent';
import './utils/suppressWarning';

const App = () => {
  useEffect(() => SplashScreen.hide(), []);
  const colorScheme = useColorScheme()!;

  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider
          theme={getTheme(colorScheme.toString())}
          settings={{ icon: props => <IconProvider {...props} /> }}>
          <AppNavigationContainer />
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  );
};

export default App;
