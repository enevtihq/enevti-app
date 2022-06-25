import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppWallet from 'enevti-app/components/organism/wallet/AppWallet';
import AppHeaderAction from 'enevti-app/components/atoms/view/AppHeaderAction';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import { useSelector } from 'react-redux';
import { openQRScanner } from 'enevti-app/utils/qr/openQRScanner';
import { parseQRLink } from 'enevti-app/utils/qr/parseQRValue';
import { parseAppLink } from 'enevti-app/utils/linking';
import { Linking } from 'react-native';
import { handleError } from 'enevti-app/utils/error/handle';

type Props = StackScreenProps<RootStackParamList, 'Wallet'>;

export default function Wallet({ navigation, route }: Props) {
  const { t } = useTranslation();
  const myPersona = useSelector(selectMyPersonaCache);

  const screenRoute = React.useMemo(
    () => ({ key: route.key, name: route.name, params: route.params, path: route.path }),
    [route.key, route.params, route.name, route.path],
  ) as RouteProp<RootStackParamList, 'Wallet'>;

  const isMyPersona = React.useMemo(
    () =>
      (route.params.mode === 'a' && route.params.arg === myPersona.address) ||
      (route.params.mode === 'u' && route.params.arg === myPersona.username) ||
      (route.params.mode === 'b' && route.params.arg === myPersona.base32),
    [myPersona.address, myPersona.base32, myPersona.username, route.params.arg, route.params.mode],
  );

  const onQRSuccess = React.useCallback(
    (data: string) => {
      try {
        const qrValue = parseQRLink(data);
        if (qrValue) {
          const parsed = parseAppLink(qrValue);
          Linking.openURL(parsed);
          return;
        }
        throw Error(t('error:unknownQRFormat'));
      } catch (err: any) {
        handleError(err);
      }
    },
    [t],
  );

  const handleQRCode = React.useCallback(
    () => openQRScanner({ navigation, onSuccess: onQRSuccess }),
    [navigation, onQRSuccess],
  );

  return (
    <AppView
      darken
      withLoader
      edges={['left', 'bottom', 'right']}
      header={
        <AppHeader back navigation={navigation} title={t('wallet:wallet')}>
          {isMyPersona ? <AppHeaderAction icon={iconMap.utilityQR} onPress={handleQRCode} /> : null}
        </AppHeader>
      }>
      <AppWallet navigation={navigation} route={screenRoute} />
    </AppView>
  );
}
