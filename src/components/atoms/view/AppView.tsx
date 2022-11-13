import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { hideSnackbar, selectSnackBarState } from 'enevti-app/store/slices/ui/global/snackbar';
import AppSnackbar from 'enevti-app/components/atoms/snackbar/AppSnackbar';
import { SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import AppKeyboardDismissOnClickView from './AppKeyboardDismissOnClickView';
import AppContainer from './AppContainer';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AppPaymentModal from 'enevti-app/components/organism/payment/AppPaymentModal';
import AppModalLoader from 'enevti-app/components/atoms/loading/AppModalLoader';
import { ModalContext } from 'enevti-app/context';

interface AppViewProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  headerOffset?: number;
  darken?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  dismissKeyboard?: boolean;
  withModal?: boolean;
  withSnackbar?: boolean;
  withPayment?: boolean;
  withPaymentOnly?: boolean;
  withLoader?: boolean;
  edges?: Edge[];
}

export default function AppView({
  children,
  header,
  style,
  contentContainerStyle,
  edges,
  headerOffset,
  withModal = false,
  withSnackbar = true,
  withPayment = false,
  withPaymentOnly = false,
  withLoader = false,
  darken = false,
  dismissKeyboard = false,
}: AppViewProps) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const snackbarState = useSelector(selectSnackBarState);

  return (
    <ModalContext.Provider value={withModal}>
      <AppKeyboardDismissOnClickView activate={dismissKeyboard}>
        <View style={[styles.view, style]}>
          {withModal ? (
            <BottomSheetModalProvider>
              <AppContainer
                style={contentContainerStyle}
                header={header}
                headerOffset={headerOffset}
                darken={darken}
                edges={edges}>
                {children}
              </AppContainer>
              {withPayment ? <AppPaymentModal /> : null}
            </BottomSheetModalProvider>
          ) : (
            <AppContainer
              style={contentContainerStyle}
              header={header}
              headerOffset={headerOffset}
              darken={darken}
              edges={edges}>
              {children}
            </AppContainer>
          )}
          {withPaymentOnly ? <AppPaymentModal /> : null}
          {withLoader || withPayment ? <AppModalLoader /> : null}
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
    </ModalContext.Provider>
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
