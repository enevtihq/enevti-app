import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { parseAmount } from '../../../utils/format/amount';
import AppTextBody3 from '../../atoms/text/AppTextBody3';
import { Popable } from 'react-native-popable';
import AppIconComponent, { iconMap } from '../../atoms/icon/AppIconComponent';
import { useTheme } from 'react-native-paper';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import Color from 'color';
import { Theme } from '../../../theme/default';
import AppTextHeading5 from '../../atoms/text/AppTextHeading5';
import AppTextBody5 from '../../atoms/text/AppTextBody5';

interface AppPaymentItemProps {
  title: string;
  amount: bigint;
  currency: string;
  description?: string;
  hideTooltip?: boolean;
  bold?: boolean;
}

function Component({
  title,
  amount,
  currency,
  description,
  hideTooltip,
  bold,
}: AppPaymentItemProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const AppText = bold ? AppTextHeading3 : AppTextBody3;
  const CurrencyText = bold ? AppTextHeading5 : AppTextBody5;

  return (
    <View style={styles.paymentItemView}>
      <View style={styles.titleContainer}>
        <AppText>{title} </AppText>
        {description && !hideTooltip ? (
          <Popable
            position={'right'}
            style={styles.popableView}
            content={
              <View style={styles.popableContent}>
                <AppTextBody4 style={styles.popableText}>
                  {description}
                </AppTextBody4>
              </View>
            }>
            <AppIconComponent
              name={iconMap.info}
              color={theme.colors.text}
              size={hp('2%', insets)}
            />
          </Popable>
        ) : null}
      </View>
      <View style={styles.currencyContainer}>
        <AppText>{parseAmount(amount.toString())} </AppText>
        <CurrencyText>${currency}</CurrencyText>
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    paymentItemView: {
      flexDirection: 'row',
      marginBottom: hp('1%', insets),
    },
    titleContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
    currencyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    popableView: {
      width: wp('50%', insets),
    },
    popableContent: {
      padding: 10,
      backgroundColor: theme.dark
        ? Color(theme.colors.text).lighten(0.5).rgb().string()
        : Color(theme.colors.text).darken(0.05).rgb().string(),
    },
    popableText: {
      color: theme.colors.background,
    },
  });

const AppPaymentItem = React.memo(Component);
export default AppPaymentItem;
