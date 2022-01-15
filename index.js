/**
 * @format
 */

import React from 'react';
import { AppRegistry, useColorScheme } from 'react-native';
import App from './src/App';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { name as appName } from './app.json';
import store from './src/store/state';
import { getTheme } from './src/theme';

export default function Main() {
  const colorScheme = useColorScheme();
  return (
    // <StoreProvider store={store}>
    <PaperProvider theme={getTheme(colorScheme.toString())}>
      <App />
    </PaperProvider>
    // </StoreProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
