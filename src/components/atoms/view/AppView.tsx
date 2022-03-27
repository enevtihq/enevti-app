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
import AppPaymentModal from '../../organism/payment/AppPaymentModal';
import AppModalLoader from '../loading/AppModalLoader';

interface AppViewProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  headerHeight?: number;
  translucentStatusBar?: boolean;
  darken?: boolean;
  style?: StyleProp<ViewStyle>;
  dismissKeyboard?: boolean;
  withModal?: boolean;
  withSnackbar?: boolean;
  withPayment?: boolean;
  withLoader?: boolean;
  edges?: Edge[];
}

export default function AppView({
  children,
  header,
  style,
  edges,
  headerHeight,
  withModal = false,
  withSnackbar = true,
  withPayment = false,
  withLoader = false,
  darken = false,
  dismissKeyboard = false,
  translucentStatusBar = false,
}: AppViewProps) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const snackbarState = useSelector(selectSnackBarState);

  return (
    <AppKeyboardDismissOnClickView activate={dismissKeyboard}>
      <View style={[styles.view, style]}>
        {withModal ? (
          <BottomSheetModalProvider>
            <AppContainer
              translucentStatusBar={translucentStatusBar}
              header={header}
              headerHeight={headerHeight}
              darken={darken}
              edges={edges}>
              {children}
            </AppContainer>
            {withPayment ? <AppPaymentModal /> : null}
          </BottomSheetModalProvider>
        ) : (
          <AppContainer
            translucentStatusBar={translucentStatusBar}
            header={header}
            headerHeight={headerHeight}
            darken={darken}
            edges={edges}>
            {children}
          </AppContainer>
        )}
        {withLoader ? <AppModalLoader /> : null}
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
