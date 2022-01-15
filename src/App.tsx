import React, { useEffect } from 'react';

import SplashScreen from 'react-native-splash-screen';
import AppNavigationContainer from './navigation';

const App = () => {
  useEffect(() => SplashScreen.hide(), []);
  return <AppNavigationContainer />;
};

export default App;
