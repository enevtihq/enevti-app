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
import { isProfileUndefined, selectProfileView } from 'enevti-app/store/slices/ui/view/profile';
import { RootState } from 'enevti-app/store/state';
import { appSocket } from 'enevti-app/utils/network';
import { Socket } from 'socket.io-client';
import { reduceNewUsername } from 'enevti-app/store/middleware/thunk/socket/profile/username/reduceNewUsername';
import { reduceBalanceChanged } from 'enevti-app/store/middleware/thunk/socket/profile/balance/reduceBalanceChanged';
import { reduceTotalStakeChanged } from 'enevti-app/store/middleware/thunk/socket/profile/totalStake/reduceTotalStakeChanged';

type Props = StackScreenProps<RootStackParamList, 'Profile'>;

export default function Profile({ navigation, route }: Props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(), []);
  const headerHeight = hp(HEADER_HEIGHT_PERCENTAGE, insets);

  const profile = useSelector((state: RootState) => selectProfileView(state, route.params.arg));
  const profileUndefined = useSelector((state: RootState) => isProfileUndefined(state, route.params.arg));
  const socket = React.useRef<Socket | undefined>();

  React.useEffect(() => {
    socket.current = appSocket(profile.persona.address);
    socket.current.on('usernameChanged', (payload: any) => dispatch(reduceNewUsername(payload, route.params.arg)));
    socket.current.on('balanceChanged', (payload: any) => dispatch(reduceBalanceChanged(payload, route.params.arg)));
    socket.current.on('totalStakeChanged', (payload: any) =>
      dispatch(reduceTotalStakeChanged(payload, route.params.arg)),
    );
    return function cleanup() {
      socket.current && socket.current.disconnect();
    };
  }, [profile.persona.address, dispatch, route.params.arg]);

  return (
    <AppView
      darken
      withModal
      withLoader
      edges={['left', 'right', 'bottom']}
      headerOffset={insets.top}
      header={<AppHeader back navigation={navigation} title={t('home:profile')} />}>
      <View style={styles.textContainer}>
        <AppProfile
          disableHeaderAnimation
          navigation={navigation}
          route={route}
          headerHeight={headerHeight}
          profile={profile}
          profileUndefined={profileUndefined}
        />
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
