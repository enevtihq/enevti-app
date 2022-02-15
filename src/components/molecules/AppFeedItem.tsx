import { View, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { SafeAreaInsets, wp } from '../../utils/imageRatio';
import { Theme } from '../../theme/default';
import color from 'color';
import AppFeedHeader from './feed/AppFeedHeader';
import AppFeedAction from './feed/AppFeedAction';
import AppFeedFooter from './feed/AppFeedFooter';
import { HomeFeedItemResponse } from '../../types/service/homeFeedItem';
import AppFeedBody from './feed/AppFeedBody';

interface AppFeedItemProps {
  feed: HomeFeedItemResponse;
}

export default React.memo(
  function AppFeedItem({ feed }: AppFeedItemProps) {
    const insets = useSafeAreaInsets();
    const theme = useTheme() as Theme;
    const styles = makeStyle(insets, theme);

    const canvasWidth = Dimensions.get('window').width * 0.9;

    return (
      <View style={styles.card}>
        <AppFeedHeader feed={feed} />
        <AppFeedBody canvasWidth={canvasWidth} feed={feed} />
        <AppFeedAction feed={feed} />
        <AppFeedFooter feed={feed} />
      </View>
    );
  },
  (props, nextProps) => {
    if (props.feed === nextProps.feed) {
      return true;
    } else {
      return false;
    }
  },
);

const makeStyle = (insets: SafeAreaInsets, theme: Theme) =>
  StyleSheet.create({
    card: {
      marginHorizontal: wp('5%', insets),
      marginBottom: wp('5%', insets),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: color(theme.colors.text).alpha(0.05).rgb().toString(),
    },
  });
