import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import { View } from 'react-native';

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
  const [isVisible, setIsVisible] = React.useState<boolean>(visible);

  React.useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    }
  }, [visible]);

  const onChange = (index: number) => {
    if (index < 0) {
      setIsVisible(false);
      onDismiss();
    } else {
      if (!isVisible) {
        setIsVisible(true);
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
