import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { Theme } from 'enevti-app/theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { FeedItem } from 'enevti-app/types/service/enevti/feed';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

interface AppFeedActionProps {
  feed: FeedItem;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default React.memo(
  function AppFeedAction({ feed, navigation }: AppFeedActionProps) {
    const insets = useSafeAreaInsets();
    const theme = useTheme() as Theme;
    const styles = React.useMemo(() => makeStyles(insets), [insets]);
    const [like, setLike] = React.useState<1 | 0>(0);

    const onLikeActivate = () => {
      setLike(1);
    };

    const onLikeDeactivate = () => {
      setLike(0);
    };

    const onComment = () => {};

    const onBuy = React.useCallback(() => {
      navigation.push('Collection', { arg: feed.id, mode: 'id' });
    }, [navigation, feed.id]);

    return (
      <View style={styles.actionContainer}>
        <AppQuaternaryButton
          icon={like ? iconMap.likeActive : iconMap.likeInactive}
          iconSize={wp('6%', insets)}
          iconColor={like ? theme.colors.primary : theme.colors.text}
          style={styles.button}
          onPress={() => (like ? onLikeDeactivate() : onLikeActivate())}>
          <AppTextBody4
            style={[
              styles.actionButtonText,
              { color: like ? theme.colors.primary : theme.colors.text },
            ]}>
            {feed.like + like}
          </AppTextBody4>
        </AppQuaternaryButton>

        <AppQuaternaryButton
          icon={iconMap.comment}
          iconSize={wp('6%', insets)}
          style={styles.button}
          onPress={() => onComment()}>
          <AppTextBody4 style={styles.actionButtonText}>
            {feed.comment}
          </AppTextBody4>
        </AppQuaternaryButton>

        <View style={styles.divider} />

        <AppQuaternaryButton
          box
          icon={iconMap.buy}
          iconSize={wp('6%', insets)}
          style={styles.button}
          contentStyle={{
            paddingVertical: hp('0.5%', insets),
            paddingHorizontal: wp('1%', insets),
          }}
          onPress={() => onBuy()}>
          <AppTextHeading4 style={styles.actionButtonText}>
            {parseAmount(feed.price.amount)}{' '}
            <AppTextBody5>${feed.price.currency}</AppTextBody5>
          </AppTextHeading4>
        </AppQuaternaryButton>
      </View>
    );
  },
  () => {
    return true;
  },
);

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    button: {
      height: '100%',
    },
    actionButtonText: {
      textAlign: 'center',
    },
    divider: {
      flex: 1,
    },
    actionContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: wp('2%', insets),
      paddingHorizontal: wp('3%', insets),
      height: hp('6%', insets),
    },
  });
