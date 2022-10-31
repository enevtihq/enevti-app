import { AppState, Image, Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { hp, wp } from 'enevti-app/utils/imageRatio';
import AppTextHeading1 from 'enevti-app/components/atoms/text/AppTextHeading1';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import OverlayPermissionModule from 'rn-android-overlay-permission';
import { RootStackParamList } from 'enevti-app/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { selectDisplayState } from 'enevti-app/store/slices/ui/screen/display';
import { useSelector } from 'react-redux';
import AppConfirmationModal from 'enevti-app/components/organism/menu/AppConfirmationModal';
import { Theme } from 'enevti-app/theme/default';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { isOverlayPermissionGranted } from 'enevti-app/utils/permission';

type Props = StackScreenProps<RootStackParamList, 'RequestOverlayPermission'>;

export default function RequestOverlayPermission({ navigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);
  const display = useSelector(selectDisplayState);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const onActionButtonPress = React.useCallback(async () => {
    if (Platform.OS === 'android') {
      setModalVisible(false);
      if (Platform.constants.Version >= 23) {
        OverlayPermissionModule.requestOverlayPermission();
      } else {
        navigation.replace('CreateAccount');
      }
    }
  }, [navigation]);

  const handleChange = React.useCallback(
    (nextState: string) => {
      if (!display.maximized && nextState === 'active') {
        isOverlayPermissionGranted().then(isGranted => {
          if (isGranted) {
            navigation.replace('CreateAccount');
          } else {
            setModalVisible(true);
          }
        });
      }
    },
    [display.maximized, navigation],
  );

  React.useEffect(() => {
    const listener = AppState.addEventListener('change', handleChange);
    return function cleanup() {
      listener.remove();
    };
  }, [handleChange]);

  const onModalDismiss = React.useCallback(() => setModalVisible(false), []);

  const onCancelPress = React.useCallback(() => navigation.replace('CreateAccount'), [navigation]);

  return (
    <AppView withModal>
      <AppConfirmationModal
        iconName={'videoOff'}
        visible={modalVisible}
        title={t('onboarding:overlayPermissionNotYetTitle')}
        description={t('onboarding:overlayPermissionNotYetDescription')}
        onDismiss={onModalDismiss}
        okText={t('onboarding:overlayPermissionNotYetOkText')}
        okOnPress={onActionButtonPress}
        cancelText={t('onboarding:overlayPermissionNotYetCancelText')}
        cancelOnPress={onCancelPress}
      />
      <View style={styles.itemContainer}>
        <View style={{ height: hp(5) }} />
        <AppTextHeading1 style={styles.itemTitle}>{t('onboarding:overlayPermissionTitle')}</AppTextHeading1>
        <AppTextBody3 style={styles.itemDescription}>{t('onboarding:overlayPermissionDescription')}</AppTextBody3>
        <View style={styles.itemComponent}>
          {theme.dark ? (
            <Image
              style={styles.componentImage}
              source={require('enevti-app/assets/illustration/overlay-permission-dark.jpeg')}
            />
          ) : (
            <Image
              style={styles.componentImage}
              source={require('enevti-app/assets/illustration/overlay-permission-light.jpeg')}
            />
          )}
        </View>
      </View>
      <View style={styles.button}>
        <AppPrimaryButton onPress={onActionButtonPress}>{t('onboarding:overlayPermissionButton')}</AppPrimaryButton>
      </View>
    </AppView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    image: {
      width: '100%',
      height: '100%',
    },
    componentImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    button: {
      paddingHorizontal: wp(5),
      paddingVertical: hp(4),
    },
    itemContainer: {
      flex: 1,
      paddingHorizontal: wp(10),
    },
    itemTitle: {
      textAlign: 'center',
      marginBottom: hp(3),
    },
    itemDescription: {
      textAlign: 'center',
    },
    itemComponent: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
  });
