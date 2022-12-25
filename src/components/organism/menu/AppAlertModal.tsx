import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppHeaderWizard from 'enevti-app/components/molecules/view/AppHeaderWizard';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppSecondaryButton from 'enevti-app/components/atoms/button/AppSecondaryButton';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTheme } from 'react-native-paper';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';

interface AppAlertModalProps {
  visible: boolean;
  onDismiss: () => void;
  iconName: keyof typeof iconMap;
  title: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonOnPress?: () => void;
  primaryButtonIsLoading?: boolean;
  secondaryButtonText?: string;
  secondaryButtonOnPress?: () => void;
  secondaryButtonIsLoading?: boolean;
  tertiaryButtonText?: string;
  tertiaryButtonOnPress?: () => void;
  tertiaryButtonIsLoading?: boolean;
  enablePanDownToClose?: boolean;
  tapEverywhereToDismiss?: boolean;
  height?: number;
}

export default function AppAlertModal({
  visible,
  title,
  iconName,
  description,
  onDismiss,
  primaryButtonText,
  primaryButtonOnPress,
  primaryButtonIsLoading,
  secondaryButtonText,
  secondaryButtonOnPress,
  secondaryButtonIsLoading,
  tertiaryButtonText,
  tertiaryButtonOnPress,
  tertiaryButtonIsLoading,
  enablePanDownToClose,
  tapEverywhereToDismiss,
  height,
}: AppAlertModalProps) {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(), []);
  const snapPoints = React.useMemo(
    () =>
      height ?? 43 + (primaryButtonText ? 8.5 : 0) + (secondaryButtonText ? 8.5 : 0) + (tertiaryButtonText ? 8.5 : 0),
    [primaryButtonText, secondaryButtonText, tertiaryButtonText, height],
  );

  return (
    <AppMenuContainer
      tapEverywhereToDismiss={tapEverywhereToDismiss}
      enablePanDownToClose={enablePanDownToClose}
      visible={visible}
      snapPoints={[`${snapPoints}%`]}
      onDismiss={onDismiss}>
      <AppHeaderWizard
        noHeaderSpace
        mode={'icon'}
        modeData={iconName}
        style={styles.alertContainer}
        title={title}
        description={description}
      />
      <View style={{ padding: wp('10%') }}>
        {primaryButtonText ? (
          <View>
            <AppPrimaryButton loading={primaryButtonIsLoading} onPress={primaryButtonOnPress}>
              {primaryButtonText}
            </AppPrimaryButton>
            <View style={{ height: hp('1%') }} />
          </View>
        ) : null}
        {secondaryButtonText ? (
          <View>
            <AppSecondaryButton loading={secondaryButtonIsLoading} onPress={secondaryButtonOnPress}>
              {secondaryButtonText}
            </AppSecondaryButton>
            <View style={{ height: hp('1%') }} />
          </View>
        ) : null}
        {tertiaryButtonText ? (
          <AppQuaternaryButton
            loading={tertiaryButtonIsLoading}
            contentStyle={styles.tertiaryAction}
            onPress={tertiaryButtonOnPress}>
            <AppTextBody4 style={{ color: theme.colors.text }}>{tertiaryButtonText}</AppTextBody4>
          </AppQuaternaryButton>
        ) : null}
      </View>
    </AppMenuContainer>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    alertContainer: {
      width: wp('90%'),
      marginTop: hp('3%'),
      alignSelf: 'center',
      flex: 1,
    },
    tertiaryAction: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
