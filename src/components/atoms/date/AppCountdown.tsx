import React from 'react';
import { AppState, NativeEventSubscription, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import ReactNativeCountdownComponent from 'react-native-countdown-component';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets } from 'enevti-app/utils/layout/imageRatio';
import { Theme } from 'enevti-app/theme/default';
import { useTranslation } from 'react-i18next';

class CountDown extends ReactNativeCountdownComponent {
  appState: NativeEventSubscription | undefined = undefined;

  componentDidMount() {
    this.appState = AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.appState && this.appState.remove();
  }
}

interface AppCountdownProps {
  until: number;
  style?: StyleProp<ViewStyle>;
  theme?: Theme;
  onFinish?: () => void;
}

export default function AppCountdown({ until, style, theme, onFinish }: AppCountdownProps) {
  const { t } = useTranslation();
  const paperTheme = useTheme() as Theme;
  const countdownTheme = theme ?? paperTheme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(countdownTheme, insets), [countdownTheme, insets]);
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
      onFinish={onFinish}
    />
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    timeLabelStyle: {
      color: theme.colors.placeholder,
      fontFamily: theme.fonts.regular.fontFamily,
    },
    digitStyle: {
      backgroundColor: 'transparent',
      height: hp('2.25%', insets),
    },
    digitTxtStyle: {
      color: theme.colors.text,
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: theme.fonts.medium.fontWeight,
    },
  });
