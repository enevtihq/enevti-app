import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppSecondaryButton from 'enevti-app/components/atoms/button/AppSecondaryButton';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';

interface AppConfirmationModalProps {
  visible: boolean;
  onDismiss: () => void;
  iconName: keyof typeof iconMap;
  title: string;
  description: string;
  okText: string;
  okOnPress: () => void;
  cancelText: string;
  cancelOnPress: () => void;
  enablePanDownToClose?: boolean;
}

export default function AppConfirmationModal({
  visible,
  onDismiss,
  iconName,
  title,
  description,
  okOnPress,
  okText,
  cancelText,
  cancelOnPress,
  enablePanDownToClose,
}: AppConfirmationModalProps) {
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const snapPoints = React.useMemo(() => ['47%'], []);
  return (
    <AppMenuContainer
      tapEverywhereToDismiss
      enablePanDownToClose={enablePanDownToClose}
      snapPoints={snapPoints}
      visible={visible}
      onDismiss={onDismiss}>
      <AppHeaderWizard
        noHeaderSpace
        mode={'icon'}
        modeData={iconName}
        style={styles.container}
        title={title}
        titleStyle={styles.titleStyle}
        description={description}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonItem}>
          <AppSecondaryButton onPress={cancelOnPress}>{cancelText}</AppSecondaryButton>
        </View>
        <View style={styles.buttonContainerSpace} />
        <View style={styles.buttonItem}>
          <AppPrimaryButton onPress={okOnPress}>{okText}</AppPrimaryButton>
        </View>
      </View>
    </AppMenuContainer>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      width: wp('90%', insets),
      alignSelf: 'center',
      flex: 1,
    },
    titleStyle: {
      marginTop: hp('1%', insets),
    },
    buttonContainer: {
      paddingHorizontal: wp('5%', insets),
      paddingBottom: wp('10%', insets),
      marginTop: hp('3%', insets),
      flexDirection: 'row',
    },
    buttonItem: {
      flex: 1,
    },
    buttonContainerSpace: {
      marginHorizontal: wp('1%', insets),
    },
  });
