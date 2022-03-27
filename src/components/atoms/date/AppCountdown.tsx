import React from 'react';
import {
  AppState,
  NativeEventSubscription,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import ReactNativeCountdownComponent from 'react-native-countdown-component';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { wp, hp, SafeAreaInsets } from '../../../utils/imageRatio';
import { Theme } from '../../../theme/default';
import { useTranslation } from 'react-i18next';

class CountDown extends ReactNativeCountdownComponent {
  appState: NativeEventSubscription | undefined = undefined;

  componentDidMount() {
    this.appState = AppState.addEventListener(
      'change',
      this._handleAppStateChange,
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.appState && this.appState.remove();
  }
}

interface AppCountdownProps {
  until: number;
  style?: StyleProp<ViewStyle>;
}

export default function AppCountdown({ until, style }: AppCountdownProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyle(theme, insets), [theme, insets]);
  const timeLabels = React.useMemo(
    () => ({
      d: t('date:days'),
      h: t('date:hours'),
      m: t('date:minutes'),
      s: t('date:seconds'),
    }),
    [t],
  );

  return (
    <CountDown
      until={until}
      style={style}
      timeLabelStyle={styles.timeLabelStyle}
      digitStyle={styles.digitStyle}
      digitTxtStyle={styles.digitTxtStyle}
      timeLabels={timeLabels}
    />
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    timeLabelStyle: {
      color: theme.colors.placeholder,
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: wp('2.2%', insets),
    },
    digitStyle: {
      backgroundColor: 'transparent',
      height: hp('3%', insets),
      width: wp('9%', insets),
    },
    digitTxtStyle: {
      color: theme.colors.text,
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: theme.fonts.medium.fontWeight,
      fontSize: wp('5.2%', insets),
    },
  });
