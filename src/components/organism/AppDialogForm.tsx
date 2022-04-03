import React from 'react';
import { Portal, Dialog, useTheme } from 'react-native-paper';
import { Keyboard, View, StyleSheet } from 'react-native';

import AppIconGradient from 'enevti-app/components/molecules/AppIconGradient';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { hp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTextHeading1 from 'enevti-app/components/atoms/text/AppTextHeading1';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppKeyboardDismissOnClickView from 'enevti-app/components/atoms/view/AppKeyboardDismissOnClickView';

interface AppDialogFormProps {
  children: React.ReactNode;
  visible: boolean;
  title: string;
  description: string;
  icon: string;
  onDismiss?: () => void;
}

export default function AppDialogForm({
  children,
  visible,
  title,
  description,
  icon,
  onDismiss,
}: AppDialogFormProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);
  const [bottom, setBottom] = React.useState<number>(0);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setBottom(e.endCoordinates.height / 2);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setBottom(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Portal>
      <Dialog visible={visible} dismissable={false} style={{ bottom: bottom }}>
        <AppKeyboardDismissOnClickView activate={true}>
          <View>
            <AppIconButton icon={iconMap.close} onPress={onDismiss} />
            <AppIconGradient
              name={icon}
              size={50}
              colors={[theme.colors.primary, theme.colors.accent]}
              style={styles.icon}
            />
            <Dialog.Title style={styles.title}>
              <AppTextHeading1>{title}</AppTextHeading1>
            </Dialog.Title>
            <Dialog.Content style={styles.content}>
              <AppTextBody4 style={styles.content}>{description}</AppTextBody4>
            </Dialog.Content>
            {children}
          </View>
        </AppKeyboardDismissOnClickView>
      </Dialog>
    </Portal>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    icon: { alignSelf: 'center' },
    title: {
      alignSelf: 'center',
      marginBottom: hp('3%', insets),
    },
    content: {
      alignSelf: 'center',
      textAlign: 'center',
      paddingBottom: hp('1.25%', insets),
    },
  });
