import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { BackHandler, View } from 'react-native';

interface AppMenuContainerProps {
  visible: boolean;
  anchor: React.ReactNode;
  children: React.ReactNode;
  onDismiss: () => void;
  snapPoints?: string[];
}

export default function AppMenuContainer({
  visible,
  onDismiss,
  anchor,
  children,
  snapPoints,
}: AppMenuContainerProps) {
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const defaultSnapPoints = React.useMemo(() => ['50%'], []);
  const isVisible = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isVisible.current) {
          bottomSheetRef.current?.dismiss();
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isVisible]),
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
      onDismiss();
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
        appearsOnIndex={snapPoints ? snapPoints.length - 1 : 0}
        disappearsOnIndex={-1}
        pressBehavior={'none'}
      />
    ),
    [snapPoints],
  );

  return (
    <View>
      {anchor}
      <BottomSheetModal
        ref={bottomSheetRef}
        onChange={onChange}
        snapPoints={snapPoints ?? defaultSnapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}>
        {children}
      </BottomSheetModal>
    </View>
  );
}
