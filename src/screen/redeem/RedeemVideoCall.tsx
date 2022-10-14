import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppRedeemVideoCall from 'enevti-app/components/organism/redeem/videoCall/AppRedeemVideoCall';
import { RouteProp } from '@react-navigation/native';
import darkTheme from 'enevti-app/theme/dark';

type Props = StackScreenProps<RootStackParamList, 'RedeemVideoCall'>;

export default function RedeemVideoCall({ navigation, route }: Props) {
  const screenRoute = React.useMemo(
    () => ({ key: route.key, name: route.name, params: route.params, path: route.path }),
    [route.key, route.params, route.name, route.path],
  ) as RouteProp<RootStackParamList, 'RedeemVideoCall'>;

  return (
    <AppView
      darken
      withModal
      withPayment
      edges={['left', 'right']}
      contentContainerStyle={{ backgroundColor: darkTheme.colors.background }}>
      <AppRedeemVideoCall navigation={navigation} route={screenRoute} />
    </AppView>
  );
}
