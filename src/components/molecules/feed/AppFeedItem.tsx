import { View, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { Theme } from 'enevti-app/theme/default';
import Color from 'color';
import AppFeedHeader from './AppFeedHeader';
import AppFeedAction from './AppFeedAction';
import AppFeedFooter from './AppFeedFooter';
import { FeedItem } from 'enevti-app/types/core/service/feed';
import AppFeedBody from './AppFeedBody';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

interface AppFeedItemProps {
  feed: FeedItem;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default React.memo(
  function AppFeedItem({ feed, navigation }: AppFeedItemProps) {
    const insets = useSafeAreaInsets();
    const theme = useTheme() as Theme;
    const styles = React.useMemo(
      () => makeStyles(theme, insets),
      [theme, insets],
    );

    const canvasWidth = Dimensions.get('window').width * 0.9;

    return (
      <View style={styles.card}>
        <AppFeedHeader feed={feed} navigation={navigation} />
        <AppFeedBody canvasWidth={canvasWidth} feed={feed} />
        <AppFeedAction feed={feed} navigation={navigation} />
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

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    card: {
      marginHorizontal: wp('5%', insets),
      marginBottom: wp('5%', insets),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
    },
  });
