import { Platform, View } from 'react-native';
import React from 'react';
import AppMenuContainer from '../../atoms/menu/AppMenuContainer';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearPaymentState,
  selectPaymentHeader,
  selectPaymentItem,
  selectPaymentShowState,
  selectPaymentTotalAmount,
} from '../../../store/slices/payment';
import { hp, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTextHeading2 from '../../atoms/text/AppTextHeading2';
import AppListItem from '../../molecules/list/AppListItem';
import { Divider, useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppIconGradient from '../../molecules/AppIconGradient';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import AppTextBody3 from '../../atoms/text/AppTextBody3';
import { parseAmount } from '../../../utils/format/amount';
import { getCoinName } from '../../atoms/brand/AppBrandConstant';
import Color from 'color';
import AppPrimaryButton from '../../atoms/button/AppPrimaryButton';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import AppTextBody5 from '../../atoms/text/AppTextBody5';
import reducePayment from '../../../service/enevti/payment/reducer/pay';

export default function AppPaymentModal() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const paymentShowState = useSelector(selectPaymentShowState);
  const paymentHeader = useSelector(selectPaymentHeader);
  const paymentItem = useSelector(selectPaymentItem);
  const paymentTotalAmount = useSelector(selectPaymentTotalAmount);
  const paymentTotalAmountCurrency = getCoinName();
  const paymentSnapPoints = React.useMemo(() => ['60%'], []);

  const paymentDismiss = React.useCallback(() => {
    dispatch(clearPaymentState());
  }, [dispatch]);

  return (
    <AppMenuContainer
      enablePanDownToClose
      snapPoints={paymentSnapPoints}
      visible={paymentShowState}
      onDismiss={paymentDismiss}>
      <AppListItem
        leftContent={
          <AppIconGradient
            name={paymentHeader.icon}
            size={wp('12%', insets)}
            androidRenderingMode={'software'}
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={{ marginRight: wp('3%', insets), alignSelf: 'center' }}
          />
        }>
        <AppTextHeading3 numberOfLines={1} style={{ width: wp('50%', insets) }}>
          {paymentHeader.name}
        </AppTextHeading3>
        <AppTextBody4
          style={{ color: theme.colors.placeholder }}
          numberOfLines={1}>
          {paymentHeader.description}
        </AppTextBody4>
      </AppListItem>
      <View style={{ height: hp('2%', insets) }} />
      <Divider
        style={{
          height: 20,
          backgroundColor: Color(theme.colors.placeholder)
            .alpha(0.05)
            .rgb()
            .toString(),
        }}
      />
      <View style={{ flex: 1, paddingHorizontal: wp('5%', insets) }}>
        <AppTextHeading2
          style={{
            marginBottom: hp('2%', insets),
            marginTop: hp('2%', insets),
          }}>
          Transaction Details
        </AppTextHeading2>
        {paymentItem.map(item => (
          <View
            key={item.name}
            style={{
              flexDirection: 'row',
              marginBottom: hp('1%', insets),
            }}>
            <AppTextBody3 style={{ flex: 1 }}>{item.title}</AppTextBody3>
            <AppTextBody3>
              {parseAmount(item.amount.toString())} ${item.currency}
            </AppTextBody3>
          </View>
        ))}
        <Divider style={{ marginBottom: hp('1%', insets) }} />
        <View style={{ flexDirection: 'row', marginBottom: hp('1%', insets) }}>
          <AppTextHeading3 style={{ flex: 1 }}>Total</AppTextHeading3>
          <AppTextHeading3>
            {parseAmount(paymentTotalAmount.toString())}{' '}
            {paymentTotalAmountCurrency}
          </AppTextHeading3>
        </View>
      </View>
      <AppListItem
        containerStyle={{ marginVertical: hp('2%', insets) }}
        leftContent={
          <AppIconGradient
            name={iconMap.shield}
            size={wp('5%', insets)}
            androidRenderingMode={'software'}
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={{ marginRight: wp('3%', insets), alignSelf: 'center' }}
          />
        }>
        <AppTextBody5
          style={{ color: theme.colors.placeholder }}
          numberOfLines={2}>
          Payement are secured using blockchain, by proceeding you are agree to
          Terms & Conditions
        </AppTextBody5>
      </AppListItem>
      <Divider />
      <View
        style={{
          paddingHorizontal: wp('5%', insets),
          marginTop: hp('2%', insets),
          marginBottom:
            Platform.OS === 'ios' ? insets.bottom : hp('2%', insets),
        }}>
        <AppPrimaryButton onPress={async () => await reducePayment()}>
          Pay
        </AppPrimaryButton>
      </View>
    </AppMenuContainer>
  );
}
