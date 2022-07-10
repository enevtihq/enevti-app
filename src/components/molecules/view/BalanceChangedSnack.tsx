import { Animated, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import sleep from 'enevti-app/utils/dummy/sleep';
import { useSelector } from 'react-redux';
import { selectMyProfileBalanceCache } from 'enevti-app/store/slices/entities/cache/myProfile';
import { Theme } from 'enevti-app/theme/default';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { getCoinName } from 'enevti-app/utils/constant/identifier';
import AppTextBodyCustom from 'enevti-app/components/atoms/text/AppTextBodyCustom';
import AppTextHeadingCustom from 'enevti-app/components/atoms/text/AppTextHeadingCustom';

interface BalanceChangedSnackProps {
  style?: StyleProp<ViewStyle>;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}

export default function BalanceChangedSnack({ onAnimationEnd, onAnimationStart, style }: BalanceChangedSnackProps) {
  const theme = useTheme() as Theme;
  const [added, setAdded] = React.useState<boolean>(false);
  const [diff, setDiff] = React.useState<string>('0');
  const styles = React.useMemo(() => makeStyles(theme, added), [theme, added]);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const myBalance = useSelector(selectMyProfileBalanceCache);
  const oldBalance = React.useRef<string>(myBalance);

  React.useEffect(() => {
    onAnimationStart && onAnimationStart();

    setAdded(BigInt(oldBalance.current) < BigInt(myBalance));
    setDiff((BigInt(oldBalance.current) - BigInt(myBalance)).toString().replace('-', ''));
    oldBalance.current = myBalance;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(async () => {
      await sleep(2000);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onAnimationEnd && onAnimationEnd());
    });
  }, [fadeAnim, onAnimationStart, onAnimationEnd, myBalance]);

  return diff !== '0' ? (
    <Animated.View style={[style, styles.container, { opacity: fadeAnim }]}>
      <AppTextHeadingCustom size={2.0} style={styles.text}>
        {added ? '+' : '-'}
        {parseAmount(diff)}{' '}
        <AppTextBodyCustom size={1.2} style={styles.text}>
          {getCoinName()}
        </AppTextBodyCustom>
      </AppTextHeadingCustom>
    </Animated.View>
  ) : null;
}

const makeStyles = (theme: Theme, added: boolean) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      paddingHorizontal: 5,
      borderRadius: theme.roundness,
      alignSelf: 'center',
      backgroundColor: added ? '#38a892' : '#B00020',
      borderColor: added ? '#38a892' : '#B00020',
      borderWidth: StyleSheet.hairlineWidth,
    },
    text: {
      color: 'white',
    },
  });
