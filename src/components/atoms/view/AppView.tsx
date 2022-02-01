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

interface AppViewProps {
  children: React.ReactNode;
  dismissKeyboard?: boolean;
}

export default function AppView({
  children,
  dismissKeyboard = false,
}: AppViewProps) {
  const insets = useSafeAreaInsets();
  const styles = makeStyles(insets);
  const snackbarState = useSelector((state: RootState) =>
    selectSnackBarState(state),
  );
  const dispatch = useDispatch();

  return (
    <View style={styles.view}>
      <AppKeyboardDismissOnClickView activate={dismissKeyboard}>
        {children}
      </AppKeyboardDismissOnClickView>
      <AppSnackbar
        mode={snackbarState.mode}
        visible={snackbarState.show}
        style={styles.snackbar}
        onDismiss={() => dispatch(hideSnackbar())}
        duration={1500}>
        {snackbarState.text}
      </AppSnackbar>
    </View>
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
