import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppQuaternaryButton from '../../atoms/button/AppQuaternaryButton';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import AppTextHeading4 from '../../atoms/text/AppTextHeading4';
import AppTextBody5 from '../../atoms/text/AppTextBody5';
import { Theme } from '../../../theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { getCoinName } from '../../atoms/brand/AppBrandConstant';
import { FeedItem } from '../../../types/service/enevti/feed';
import { parseAmount } from '../../../utils/format/amount';

interface AppFeedActionProps {
  feed: FeedItem;
}

export default React.memo(
  function AppFeedAction({ feed }: AppFeedActionProps) {
    const insets = useSafeAreaInsets();
    const theme = useTheme() as Theme;
    const styles = makeStyle(insets);
    const [like, setLike] = React.useState<1 | 0>(0);

    const onLikeActivate = () => {
      setLike(1);
    };

    const onLikeDeactivate = () => {
      setLike(0);
    };

    const onComment = () => {};

    const onBuy = () => {};

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
            {parseAmount(feed.price)}{' '}
            <AppTextBody5>{getCoinName()}</AppTextBody5>
          </AppTextHeading4>
        </AppQuaternaryButton>
      </View>
    );
  },
  () => {
    return true;
  },
);

const makeStyle = (insets: SafeAreaInsets) =>
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
