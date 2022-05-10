import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppHeaderWizard from 'enevti-app/components/molecules/AppHeaderWizard';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  secondaryButtonText?: string;
  secondaryButtonOnPress?: () => void;
  tertiaryButtonText?: string;
  tertiaryButtonOnPress?: () => void;
}

export default function AppAlertModal({
  visible,
  title,
  iconName,
  description,
  onDismiss,
  primaryButtonText,
  primaryButtonOnPress,
  secondaryButtonText,
  secondaryButtonOnPress,
  tertiaryButtonText,
  tertiaryButtonOnPress,
}: AppAlertModalProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const snapPoints = React.useMemo(
    () => 38 + (primaryButtonText ? 8.5 : 0) + (secondaryButtonText ? 8.5 : 0) + (tertiaryButtonText ? 8.5 : 0),
    [primaryButtonText, secondaryButtonText, tertiaryButtonText],
  );

  return (
    <AppMenuContainer visible={visible} snapPoints={[`${snapPoints}%`]} onDismiss={onDismiss}>
      <AppHeaderWizard
        noHeaderSpace
        mode={'icon'}
        modeData={iconName}
        style={styles.alertContainer}
        title={title}
        description={description}
      />
      <View style={{ padding: wp('10%', insets) }}>
        {primaryButtonText ? (
          <View>
            <AppPrimaryButton onPress={primaryButtonOnPress}>{primaryButtonText}</AppPrimaryButton>
            <View style={{ height: hp('1%', insets) }} />
          </View>
        ) : null}
        {secondaryButtonText ? (
          <View>
            <AppSecondaryButton onPress={secondaryButtonOnPress}>{secondaryButtonText}</AppSecondaryButton>
            <View style={{ height: hp('1%', insets) }} />
          </View>
        ) : null}
        {tertiaryButtonText ? (
          <AppQuaternaryButton contentStyle={styles.tertiaryAction} onPress={tertiaryButtonOnPress}>
            <AppTextBody4 style={{ color: theme.colors.primary }}>{tertiaryButtonText}</AppTextBody4>
          </AppQuaternaryButton>
        ) : null}
      </View>
    </AppMenuContainer>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    alertContainer: {
      width: wp('90%', insets),
      marginTop: hp('3%', insets),
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
