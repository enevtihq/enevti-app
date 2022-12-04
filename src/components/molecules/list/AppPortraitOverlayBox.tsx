import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { wp, SafeAreaInsets } from 'enevti-app/utils/layout/imageRatio';
import { Theme } from 'enevti-app/theme/default';
import { BlurView } from '@react-native-community/blur';
import AppMentionRenderer from '../comment/AppMentionRenderer';

interface AppPortraitOverlayBoxProps {
  title: string;
  foreground?: React.ReactNode;
  background?: React.ReactNode;
  blurBackground?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function AppPortraitOverlayBox({
  foreground,
  background,
  blurBackground,
  title,
  style,
  onPress,
}: AppPortraitOverlayBoxProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  return (
    <View style={[styles.container, style]}>
      {background ? <View style={styles.content}>{background}</View> : null}
      {blurBackground ? <BlurView blurAmount={10} style={styles.overlay} /> : <View style={styles.overlayColor} />}
      {foreground ? <View style={styles.content}>{foreground}</View> : null}
      <AppMentionRenderer disabled size={2.2} text={title} style={styles.textOverlay} color={'white'} />
      <TouchableRipple style={styles.rippleOverlay} onPress={onPress}>
        <View />
      </TouchableRipple>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      width: wp('25%', insets),
      height: wp('25%', insets) * 1.78,
      borderRadius: theme.roundness,
      overflow: 'hidden',
    },
    content: {
      ...StyleSheet.absoluteFillObject,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
    overlayColor: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'black',
      opacity: 0.3,
    },
    rippleOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    textOverlay: {
      ...StyleSheet.absoluteFillObject,
      color: 'white',
      padding: 3,
      top: wp('25%', insets) * 1.35,
      left: wp('1%'),
    },
  });
