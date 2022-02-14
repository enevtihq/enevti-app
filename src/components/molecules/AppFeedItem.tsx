import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { SafeAreaInsets, wp } from '../../utils/imageRatio';
import { Theme } from '../../theme/default';
import color from 'color';
import AppFeedHeader from './feed/AppFeedHeader';
import AppFeedAction from './feed/AppFeedAction';
import AppFeedFooter from './feed/AppFeedFooter';
import AppNFTListRenderer from './nft/AppNFTListRenderer';

export default function AppFeedItem() {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = makeStyle(insets, theme);

  const [canvasWidth, setCanvasWidth] = React.useState<number>(0);
  const onLayout = React.useCallback(e => {
    setCanvasWidth(e.nativeEvent.layout.width);
  }, []);

  return (
    <View onLayout={onLayout} style={styles.card}>
      <AppFeedHeader />
      <AppNFTListRenderer width={canvasWidth} itemWidth={canvasWidth} />
      <AppFeedAction />
      <AppFeedFooter />
    </View>
  );
}

const makeStyle = (insets: SafeAreaInsets, theme: Theme) =>
  StyleSheet.create({
    card: {
      margin: wp('5%', insets),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: color(theme.colors.text).alpha(0.05).rgb().toString(),
    },
  });
