import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

const Null = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return null;
};

export default Null;
