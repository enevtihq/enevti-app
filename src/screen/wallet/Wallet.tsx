import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppWallet from 'enevti-app/components/organism/wallet/AppWallet';

type Props = StackScreenProps<RootStackParamList, 'Wallet'>;

export default function Wallet({ navigation, route }: Props) {
  const { t } = useTranslation();

  const screenRoute = React.useMemo(
    () => ({ key: route.key, name: route.name, params: route.params, path: route.path }),
    [route.key, route.params, route.name, route.path],
  ) as RouteProp<RootStackParamList, 'Wallet'>;

  // TODO: add  barcode scan to header if this is my wallet

  return (
    <AppView
      darken
      withLoader
      edges={['left', 'bottom', 'right']}
      header={<AppHeader back navigation={navigation} title={t('wallet:wallet')} />}>
      <AppWallet navigation={navigation} route={screenRoute} />
    </AppView>
  );
}
