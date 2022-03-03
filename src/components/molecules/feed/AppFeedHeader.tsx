import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppTextBody5 from '../../atoms/text/AppTextBody5';
import AppQuaternaryButton from '../../atoms/button/AppQuaternaryButton';
import AppIconButton from '../../atoms/icon/AppIconButton';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCoinName } from '../../atoms/brand/AppBrandConstant';
import { useTranslation } from 'react-i18next';
import { FeedItem } from '../../../types/service/enevti/feed';
import { parseAmount } from '../../../utils/format/amount';
import { Divider, useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';
import AppAvatarRenderer from '../avatar/AppAvatarRenderer';
import AppMenuContainer from '../../atoms/menu/AppMenuContainer';
import AppMenuItem from '../../atoms/menu/AppMenuItem';
import { menuItemHeigtPercentage } from '../../../utils/layout/menuItemHeigtPercentage';

interface AppFeedHeaderProps {
  feed: FeedItem;
}

export default function AppFeedHeader({ feed }: AppFeedHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  const onStake = () => {};

  const onCloseMenu = () => {
    setMenuVisible(false);
  };

  const onOpenMenu = () => {
    setMenuVisible(true);
  };

  const onFollow = () => {
    setMenuVisible(false);
  };

  const onReport = () => {
    setMenuVisible(false);
  };

  const onPromote = () => {
    setMenuVisible(false);
  };

  return (
    <View style={styles.headerContainer}>
      <AppAvatarRenderer
        photo={feed.photo}
        address={feed.owner}
        size={wp('10%', insets)}
      />

      <View style={styles.headerAvatarInfoContainer}>
        <AppTextHeading3 numberOfLines={1}>
          {feed.username ? feed.username : feed.owner}
        </AppTextHeading3>
        {feed.promoted ? (
          <AppTextBody5 numberOfLines={1}>
            {t('home:promotedByCommunity')}
          </AppTextBody5>
        ) : (
          <View />
        )}
      </View>

      <AppQuaternaryButton
        box
        style={styles.headerPoolContainer}
        onPress={() => onStake()}>
        <AppTextHeading3 style={styles.headerPoolText}>
          {parseAmount(feed.stake, true, 2)}
        </AppTextHeading3>
        <AppTextBody5 style={styles.headerPoolText}>
          {getCoinName()}
        </AppTextBody5>
      </AppQuaternaryButton>

      <View style={styles.headerMoreButtonContainer}>
        <AppMenuContainer
          tapEverywhereToDismiss
          visible={menuVisible}
          onDismiss={onCloseMenu}
          snapPoints={[`${menuItemHeigtPercentage(3)}%`]}
          anchor={
            <AppIconButton
              icon={iconMap.dots}
              size={wp('5%', insets)}
              style={styles.headerMoreButton}
              onPress={onOpenMenu}
            />
          }>
          <AppMenuItem onPress={onFollow} title={t('home:follow')} />
          <AppMenuItem
            onPress={onReport}
            titleStyle={{ color: theme.colors.error }}
            title={t('home:report')}
          />
          <Divider />
          <AppMenuItem
            onPress={onPromote}
            disabled={!feed.delegate}
            title={t('home:promote')}
          />
        </AppMenuContainer>
      </View>
    </View>
  );
}

const makeStyle = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: wp('2%', insets),
      paddingHorizontal: wp('3%', insets),
      height: hp('7%', insets),
    },
    headerAvatarInfoContainer: {
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: wp('2%', insets),
    },
    headerPoolContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: wp('30%', insets),
      height: '100%',
    },
    headerPoolText: {
      textAlign: 'center',
    },
    headerMoreButtonContainer: {
      justifyContent: 'center',
      width: wp('8%', insets),
    },
    headerMoreButton: {
      width: wp('6%', insets),
    },
    avatar: {
      width: '100%',
      aspectRatio: 1,
    },
    stakeButtonContainer: {
      width: '100%',
    },
  });
