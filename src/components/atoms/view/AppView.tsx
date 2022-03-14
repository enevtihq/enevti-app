import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
  hideSnackbar,
  selectSnackBarState,
} from '../../../store/slices/ui/global/snackbar';
import AppSnackbar from '../snackbar/AppSnackbar';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';
import AppKeyboardDismissOnClickView from './AppKeyboardDismissOnClickView';
import AppContainer from './AppContainer';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

interface AppViewProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  darken?: boolean;
  style?: StyleProp<ViewStyle>;
  dismissKeyboard?: boolean;
  withModal?: boolean;
  withSnackbar?: boolean;
  edges?: Edge[];
}

export default function AppView({
  children,
  header,
  style,
  edges,
  withModal = false,
  withSnackbar = true,
  darken = false,
  dismissKeyboard = false,
}: AppViewProps) {
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const snackbarState = useSelector(selectSnackBarState);
  const dispatch = useDispatch();

  return (
    <AppKeyboardDismissOnClickView activate={dismissKeyboard}>
      <View style={[styles.view, style]}>
        {withModal ? (
          <BottomSheetModalProvider>
            <AppContainer header={header} darken={darken} edges={edges}>
              {children}
            </AppContainer>
          </BottomSheetModalProvider>
        ) : (
          <AppContainer header={header} darken={darken} edges={edges}>
            {children}
          </AppContainer>
        )}
        {withSnackbar ? (
          <AppSnackbar
            mode={snackbarState.mode}
            visible={snackbarState.show}
            style={styles.snackbar}
            onDismiss={() => dispatch(hideSnackbar())}
            duration={1500}>
            {snackbarState.text}
          </AppSnackbar>
        ) : null}
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
