import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { cleanVoipNotificationHandler, setupVoipNotificationHandler } from './service/call/device';

const Null = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    setupVoipNotificationHandler();
    return () => {
      cleanVoipNotificationHandler();
    };
  }, []);

  return null;
};

export default Null;
