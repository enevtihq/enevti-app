import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { Theme } from 'enevti-app/theme/default';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';

interface AppPortraitOverlayBoxProps {
  url: string;
  title: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default React.memo(
  function AppPortraitOverlayBox({ url, title, style, onPress }: AppPortraitOverlayBoxProps) {
    const insets = useSafeAreaInsets();
    const theme = useTheme() as Theme;
    const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

    return (
      <View style={[styles.container, style]}>
        <AppNetworkImage url={url} style={styles.image} />
        <View style={styles.overlay} />
        <AppTextBody4 numberOfLines={1} style={styles.textOverlay}>
          {title}
        </AppTextBody4>
        <TouchableRipple style={styles.rippleOverlay} onPress={onPress}>
          <View />
        </TouchableRipple>
      </View>
    );
  },
  () => {
    return true;
  },
);

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
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
    rippleOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    textOverlay: {
      ...StyleSheet.absoluteFillObject,
      color: 'white',
      padding: 3,
      top: wp('25%', insets) * 1.35,
    },
  });
