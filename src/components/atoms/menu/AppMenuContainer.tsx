import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { BackHandler, StyleProp, View, ViewStyle, Platform, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { shallowEqual } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppKeyboardDismissOnClickView from 'enevti-app/components/atoms/view/AppKeyboardDismissOnClickView';

interface AppMenuContainerProps {
  visible: boolean;
  children: React.ReactNode;
  onDismiss: () => void;
  anchor?: React.ReactNode;
  enablePanDownToClose?: boolean;
  transparentBackdrop?: boolean;
  dismissKeyboard?: boolean;
  snapPoints?: string[];
  tapEverywhereToDismiss?: boolean;
  backDisabled?: boolean;
  enableTouchThrough?: boolean;
  disableBackdrop?: boolean;
  enableContentPanningGesture?: boolean;
  style?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
  memoKey?: (keyof AppMenuContainerProps)[];
}

function Component({
  visible,
  onDismiss,
  anchor,
  children,
  snapPoints,
  style,
  backgroundStyle,
  disableBackdrop,
  handleIndicatorStyle,
  enableContentPanningGesture,
  enablePanDownToClose = true,
  tapEverywhereToDismiss = false,
  transparentBackdrop = false,
  backDisabled = false,
  dismissKeyboard = false,
  enableTouchThrough = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppMenuContainerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(), []);

  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const defaultSnapPoints = React.useMemo(() => ['50%'], []);
  const snapInsets = React.useMemo(() => (Platform.OS === 'android' && insets.top ? 0.95 : 1), [insets.top]);
  const isVisible = React.useRef(false);
  const MenuContainer = dismissKeyboard ? AppKeyboardDismissOnClickView : View;

  const parseSnapPoints = React.useCallback(
    (snaps: string[]) => snaps.map(a => `${parseFloat(a) * snapInsets}%`),
    [snapInsets],
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (backDisabled) {
          return true;
        }
        if (isVisible.current) {
          bottomSheetRef.current?.dismiss();
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isVisible, backDisabled]),
  );

  React.useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const onChange = (index: number) => {
    if (index < 0) {
      isVisible.current = false;
    } else {
      if (!isVisible.current) {
        isVisible.current = true;
      }
    }
  };

  const renderBackdrop = React.useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={transparentBackdrop ? 0 : undefined}
        appearsOnIndex={snapPoints ? snapPoints.length - 1 : 0}
        disappearsOnIndex={-1}
        pressBehavior={tapEverywhereToDismiss ? 'close' : 'none'}
        enableTouchThrough={enableTouchThrough}
      />
    ),
    [snapPoints, tapEverywhereToDismiss, transparentBackdrop, enableTouchThrough],
  );

  return (
    <View style={style}>
      {anchor}
      <BottomSheetModal
        ref={bottomSheetRef}
        onDismiss={onDismiss}
        handleIndicatorStyle={[{ backgroundColor: theme.colors.placeholder }, handleIndicatorStyle]}
        enableContentPanningGesture={enableContentPanningGesture}
        keyboardBehavior={'interactive'}
        keyboardBlurBehavior={'restore'}
        onChange={onChange}
        snapPoints={parseSnapPoints(snapPoints ?? defaultSnapPoints)}
        enablePanDownToClose={enablePanDownToClose}
        backgroundStyle={[{ backgroundColor: theme.colors.background }, backgroundStyle]}
        backdropComponent={disableBackdrop ? undefined : renderBackdrop}>
        <MenuContainer style={styles.menuChild}>{children}</MenuContainer>
      </BottomSheetModal>
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    menuChild: {
      flex: 1,
    },
  });

const AppMenuContainer = React.memo(Component, (prevProps, nextProps) => {
  if (prevProps.memoKey) {
    let ret = true;
    prevProps.memoKey.forEach(key => {
      if (prevProps[key] !== nextProps[key]) {
        ret = false;
      }
    });
    return ret;
  } else {
    return shallowEqual(prevProps, nextProps);
  }
});
export default AppMenuContainer;
