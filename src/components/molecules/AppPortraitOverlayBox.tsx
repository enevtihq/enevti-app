import { StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import { wp, SafeAreaInsets } from '../../utils/imageRatio';
import { useTheme } from 'react-native-paper/src/core/theming';
import FI from 'react-native-fast-image';
import AppTextBody4 from '../atoms/text/AppTextBody4';
import { Theme } from '../../theme/default';

const FastImage = createImageProgress(FI);

interface AppPortraitOverlayBoxProps {
  url: string;
  title: string;
  style?: ViewStyle;
}

export default function AppPortraitOverlayBox({
  url,
  title,
  style,
}: AppPortraitOverlayBoxProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme, insets);

  return (
    <View style={[styles.container, style]}>
      <FastImage
        style={styles.image}
        source={{
          uri: url,
          priority: FI.priority.normal,
        }}
        resizeMode={FI.resizeMode.cover}
        indicator={Progress.Circle}
        indicatorProps={{
          color: theme.colors.text,
        }}
      />
      <View style={styles.overlay} />
      <AppTextBody4 numberOfLines={1} style={styles.textOverlay}>
        {title}
      </AppTextBody4>
    </View>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      width: wp('25%', insets),
      height: wp('25%', insets) * 1.78,
      borderRadius: theme.roundness,
      overflow: 'hidden',
    },
    image: {
      height: '100%',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    textOverlay: {
      ...StyleSheet.absoluteFillObject,
      color: 'white',
      padding: 3,
      top: wp('25%', insets) * 1.35,
    },
  });
