import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import { parseAmount } from 'enevti-app/utils/format/amount';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppTextHeading5 from 'enevti-app/components/atoms/text/AppTextHeading5';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppPoppableIcon from 'enevti-app/components/molecules/menu/AppPoppableIcon';

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
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);
  const AppText = bold ? AppTextHeading3 : AppTextBody3;
  const CurrencyText = bold ? AppTextHeading5 : AppTextBody5;

  return (
    <View style={styles.paymentItemView}>
      <View style={styles.titleContainer}>
        <AppText>{title} </AppText>
        {description && !hideTooltip ? (
          <AppPoppableIcon position={'right'} content={description} />
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
  });

const AppPaymentItem = React.memo(Component);
export default AppPaymentItem;
