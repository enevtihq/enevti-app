import { Text } from 'react-native';
import React from 'react';
import AppMenuContainer from '../../atoms/menu/AppMenuContainer';
import { useDispatch, useSelector } from 'react-redux';
import {
  hidePayment,
  selectPaymentShowState,
} from '../../../store/slices/payment';

export default function AppPaymentModal() {
  const dispatch = useDispatch();
  const paymentShowState = useSelector(selectPaymentShowState);
  const paymentSnapPoints = React.useMemo(() => ['50%'], []);

  const paymentDismiss = React.useCallback(
    () => dispatch(hidePayment()),
    [dispatch],
  );

  return (
    <AppMenuContainer
      enablePanDownToClose
      snapPoints={paymentSnapPoints}
      visible={paymentShowState}
      onDismiss={paymentDismiss}>
      <Text>payment</Text>
    </AppMenuContainer>
  );
}
