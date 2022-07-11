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
import { useDispatch, useSelector } from 'react-redux';
import { openQRScanner } from 'enevti-app/utils/qr/openQRScanner';
import { parseQRLink } from 'enevti-app/utils/qr/parseQRValue';
import { parseAppLink } from 'enevti-app/utils/linking';
import { Linking } from 'react-native';
import { handleError } from 'enevti-app/utils/error/handle';
import { Socket } from 'socket.io-client';
import { appSocket } from 'enevti-app/utils/network';
import { reduceWalletBalanceChanged } from 'enevti-app/store/middleware/thunk/socket/wallet/walletBalanceChanged';
import { routeParamToAddress } from 'enevti-app/service/enevti/persona';
import { reduceNewWalletUpdates } from 'enevti-app/store/middleware/thunk/socket/wallet/newWalletActivity';

type Props = StackScreenProps<RootStackParamList, 'Wallet'>;

export default function Wallet({ navigation, route }: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const myPersona = useSelector(selectMyPersonaCache);
  const socket = React.useRef<Socket | undefined>();

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

  React.useEffect(() => {
    const subscribe = async () => {
      const address = await routeParamToAddress(route.params);
      socket.current = appSocket(address);
      socket.current.on('balanceChanged', (payload: any) => dispatch(reduceWalletBalanceChanged(payload, route.key)));
      socket.current.on('newProfileActivityUpdates', (payload: any) =>
        dispatch(reduceNewWalletUpdates(payload, route.key)),
      );
    };
    subscribe();
    return function cleanup() {
      socket.current?.disconnect();
    };
  }, [myPersona.address, dispatch, route.key, route.params]);

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
