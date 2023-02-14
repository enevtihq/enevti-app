import { View, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { wp } from 'enevti-app/utils/layout/imageRatio';
import { Theme } from 'enevti-app/theme/default';
import Color from 'color';
import AppFeedHeader from './AppFeedHeader';
import AppFeedAction from './AppFeedAction';
import AppFeedFooter from './AppFeedFooter';
import { FeedItem } from 'enevti-types/service/feed';
import AppFeedBody from './AppFeedBody';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

type FeedMode = 'floating' | 'flat';
const MODE: FeedMode = 'flat';

interface AppFeedItemProps {
  feed: FeedItem;
  navigation: StackNavigationProp<RootStackParamList>;
  index: number;
}

export default React.memo(
  function AppFeedItem({ feed, navigation, index }: AppFeedItemProps) {
    const theme = useTheme() as Theme;
    const styles = React.useMemo(() => makeStyles(theme), [theme]);

    const canvasWidth = Dimensions.get('screen').width * (MODE === 'flat' ? 1 : MODE === 'floating' ? 0.9 : 1);

    return (
      <View style={styles[MODE]}>
        <AppFeedHeader feed={feed} navigation={navigation} />
        <AppFeedBody canvasWidth={canvasWidth} feed={feed} navigation={navigation} />
        <AppFeedAction feed={feed} index={index} navigation={navigation} />
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

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    floating: {
      marginBottom: wp('5%'),
      backgroundColor: theme.colors.background,
      marginHorizontal: wp('5%'),
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
    },
    flat: {
      marginBottom: wp('5%'),
    },
  });
