import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppWalletHeader from './AppWalletHeader';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'enevti-app/store/state';
import { initWalletView, isWalletUndefined } from 'enevti-app/store/slices/ui/view/wallet';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { loadWallet, unloadWallet } from 'enevti-app/store/middleware/thunk/ui/view/wallet';
import { AppAsyncThunk } from 'enevti-app/types/ui/store/AppAsyncThunk';

interface AppWalletProps {
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Wallet'>;
}

export default function AppWallet({ navigation, route }: AppWalletProps) {
  const dispatch = useDispatch();
  const styles = React.useMemo(() => makeStyles(), []);

  const walletUndefined = useSelector((state: RootState) => isWalletUndefined(state, route.key));

  // TODO: implement onWalletLoaded
  const onWalletLoaded = React.useCallback(
    (reload: boolean = false) => {
      // return dispatch(loadWallet({ route, reload }));
      return dispatch(initWalletView(route.key));
    },
    [dispatch, route],
  ) as AppAsyncThunk;

  React.useEffect(() => {
    const promise = onWalletLoaded();
    //   return function cleanup() {
    //     dispatch(unloadWallet(route));
    //     promise.abort();
    //   };
  }, [onWalletLoaded, dispatch, route]);

  return !walletUndefined ? (
    <View>
      <AppWalletHeader navigation={navigation} route={route} />
    </View>
  ) : (
    <View style={styles.loaderContainer}>
      <AppActivityIndicator animating />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flex: 1,
    },
  });
