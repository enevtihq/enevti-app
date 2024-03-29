import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Edge } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { hideSnackbar, selectSnackBarState } from 'enevti-app/store/slices/ui/global/snackbar';
import AppSnackbar from 'enevti-app/components/atoms/snackbar/AppSnackbar';
import { wp } from 'enevti-app/utils/layout/imageRatio';
import AppKeyboardDismissOnClickView from './AppKeyboardDismissOnClickView';
import AppContainer from './AppContainer';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AppPaymentModal from 'enevti-app/components/organism/payment/AppPaymentModal';
import AppModalLoader from 'enevti-app/components/atoms/loading/AppModalLoader';
import { ModalContext } from 'enevti-app/context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

interface AppViewProps {
  children: React.ReactNode;
  navigation?: StackNavigationProp<RootStackParamList>;
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
  navigation,
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
  const styles = React.useMemo(() => makeStyles(), []);
  const [focus, setFocus] = React.useState<boolean>(true);
  const snackbarState = useSelector(selectSnackBarState);

  React.useEffect(() => {
    const unsubscribeBlur = navigation?.addListener('blur', () => {
      setFocus(false);
    });
    const unsubscribeFocus = navigation?.addListener('focus', () => {
      setFocus(true);
    });
    return () => {
      unsubscribeBlur && unsubscribeBlur();
      unsubscribeFocus && unsubscribeFocus();
    };
  }, [navigation, dispatch]);

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
              {withPayment && focus ? <AppPaymentModal /> : null}
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
          {withPaymentOnly && focus ? <AppPaymentModal /> : null}
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

const makeStyles = () =>
  StyleSheet.create({
    view: {
      flex: 1,
    },
    snackbar: {
      alignSelf: 'center',
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
  });
