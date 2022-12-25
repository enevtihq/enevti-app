import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
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
  tapEverywhereToDismiss?: boolean;
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
  tapEverywhereToDismiss = true,
}: AppConfirmationModalProps) {
  const styles = React.useMemo(() => makeStyles(), []);
  const snapPoints = React.useMemo(() => ['47%'], []);
  return (
    <AppMenuContainer
      tapEverywhereToDismiss={tapEverywhereToDismiss}
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

const makeStyles = () =>
  StyleSheet.create({
    container: {
      width: wp('90%'),
      alignSelf: 'center',
      flex: 1,
    },
    titleStyle: {
      marginTop: hp('1%'),
    },
    buttonContainer: {
      paddingHorizontal: wp('5%'),
      paddingBottom: wp('10%'),
      marginTop: hp('3%'),
      flexDirection: 'row',
    },
    buttonItem: {
      flex: 1,
    },
    buttonContainerSpace: {
      marginHorizontal: wp('1%'),
    },
  });
