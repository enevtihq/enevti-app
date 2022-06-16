import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppProfile from 'enevti-app/components/organism/profile/AppProfile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader, { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { hp } from 'enevti-app/utils/imageRatio';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfileView } from 'enevti-app/store/slices/ui/view/profile';
import { RootState } from 'enevti-app/store/state';
import { appSocket } from 'enevti-app/utils/network';
import { Socket } from 'socket.io-client';
import { reduceNewUsername } from 'enevti-app/store/middleware/thunk/socket/profile/newUsername';
import { reduceBalanceChanged } from 'enevti-app/store/middleware/thunk/socket/profile/balanceChanged';
import { reduceTotalStakeChanged } from 'enevti-app/store/middleware/thunk/socket/profile/totalStakeChanged';
import { reduceNewCollection } from 'enevti-app/store/middleware/thunk/socket/profile/newCollection';
import { reduceTotalNFTSoldChanged } from 'enevti-app/store/middleware/thunk/socket/profile/totalNFTSoldChanged';
import { reduceNewOwned } from 'enevti-app/store/middleware/thunk/socket/profile/newOwned';
import { reduceNewPending } from 'enevti-app/store/middleware/thunk/socket/profile/newPending';
import { routeParamToAddress } from 'enevti-app/service/enevti/persona';
import { RouteProp } from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'Profile'>;

export default function Profile({ navigation, route }: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(), []);
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE, insets);
  const screenRoute = React.useMemo(
    () => ({ key: route.key, name: route.name, params: route.params, path: route.path }),
    [route.key, route.params, route.name, route.path],
  ) as RouteProp<RootStackParamList, 'Profile'>;

  const profile = useSelector((state: RootState) => selectProfileView(state, route.key));
  const socket = React.useRef<Socket | undefined>();

  React.useEffect(() => {
    const run = async () => {
      if (profile.persona && profile.persona.address) {
        const key = route.key;
        const address = await routeParamToAddress(route.params);
        socket.current = appSocket(address);
        socket.current.on('usernameChanged', (payload: any) => dispatch(reduceNewUsername(payload, key)));
        socket.current.on('balanceChanged', (payload: any) => dispatch(reduceBalanceChanged(payload, key)));
        socket.current.on('totalStakeChanged', (payload: any) => dispatch(reduceTotalStakeChanged(payload, key)));
        socket.current.on('newCollection', (payload: any) => dispatch(reduceNewCollection(payload, key)));
        socket.current.on('totalNFTSoldChanged', (payload: any) => dispatch(reduceTotalNFTSoldChanged(payload, key)));
        socket.current.on('newOwned', (payload: any) => dispatch(reduceNewOwned(payload, key)));
        socket.current.on('newPending', (payload: any) => dispatch(reduceNewPending(payload, key)));
        return function cleanup() {
          socket.current?.disconnect();
        };
      }
    };

    run();
  }, [profile.persona, dispatch, route.params, route.key]);

  return (
    <AppView
      darken
      withModal
      withLoader
      edges={['left', 'right', 'bottom']}
      headerOffset={insets.top}
      header={<AppHeader back navigation={navigation} title={t('home:profile')} />}>
      <View style={styles.textContainer}>
        <AppProfile disableHeaderAnimation navigation={navigation} route={screenRoute} headerHeight={headerHeight} />
      </View>
    </AppView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
    },
  });
