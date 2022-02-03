import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
  hideSnackbar,
  selectSnackBarState,
} from '../../../store/slices/ui/global/snackbar';
import { RootState } from '../../../store/state';
import AppSnackbar from '../snackbar/AppSnackbar';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';
import AppKeyboardDismissOnClickView from './AppKeyboardDismissOnClickView';
import AppContainer from './AppContainer';

interface AppViewProps {
  children: React.ReactNode;
  darken?: boolean;
  dismissKeyboard?: boolean;
}

export default function AppView({
  children,
  darken = false,
  dismissKeyboard = false,
}: AppViewProps) {
  const insets = useSafeAreaInsets();
  const styles = makeStyles(insets);
  const snackbarState = useSelector((state: RootState) =>
    selectSnackBarState(state),
  );
  const dispatch = useDispatch();

  return (
    <AppKeyboardDismissOnClickView activate={dismissKeyboard}>
      <View style={styles.view}>
        <AppContainer darken={darken}>{children}</AppContainer>
        <AppSnackbar
          mode={snackbarState.mode}
          visible={snackbarState.show}
          style={styles.snackbar}
          onDismiss={() => dispatch(hideSnackbar())}
          duration={1500}>
          {snackbarState.text}
        </AppSnackbar>
      </View>
    </AppKeyboardDismissOnClickView>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    view: {
      flex: 1,
    },
    snackbar: {
      alignSelf: 'center',
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
  });
