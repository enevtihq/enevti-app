/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets } from '../../../utils/imageRatio';
import { parseAmount } from '../../../utils/format/amount';
import AppTextBody3 from '../../atoms/text/AppTextBody3';

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
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  return bold ? (
    <View style={styles.paymentItemView}>
      <AppTextHeading3 style={styles.title}>{title}</AppTextHeading3>
      <AppTextHeading3>
        {parseAmount(amount.toString())} ${currency}
      </AppTextHeading3>
    </View>
  ) : (
    <View style={styles.paymentItemView}>
      <AppTextBody3 style={styles.title}>{title}</AppTextBody3>
      <AppTextBody3>
        {parseAmount(amount.toString())} ${currency}
      </AppTextBody3>
    </View>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    paymentItemView: {
      flexDirection: 'row',
      marginBottom: hp('1%', insets),
    },
    title: {
      flex: 1,
    },
  });

const AppPaymentItem = React.memo(Component);
export default AppPaymentItem;
