import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppNetworkImage from '../../atoms/image/AppNetworkImage';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppTextBody5 from '../../atoms/text/AppTextBody5';
import AppQuaternaryButton from '../../atoms/button/AppQuaternaryButton';
import AppIconButton from '../../atoms/icon/AppIconButton';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCoinName } from '../../atoms/brand/AppBrandConstant';
import { useTranslation } from 'react-i18next';
import { HomeFeedItemResponse } from '../../../types/service/homeFeedItem';
import Avatar from '../../atoms/avatar';
import { IPFStoURL } from '../../../service/ipfs';
import { parseAmount } from '../../../utils/format/amount';
import { Divider, Menu, useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';

interface AppFeedHeaderProps {
  feed: HomeFeedItemResponse;
}

export default function AppFeedHeader({ feed }: AppFeedHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets, theme);

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
      <View style={styles.headerAvatarContainer}>
        {feed.photo ? (
          <AppNetworkImage style={styles.avatar} url={IPFStoURL(feed.photo)} />
        ) : (
          <Avatar address={feed.owner} />
        )}
      </View>

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
        <Menu
          visible={menuVisible}
          onDismiss={onCloseMenu}
          anchor={
            <AppIconButton
              icon={iconMap.dots}
              size={wp('5%', insets)}
              style={styles.headerMoreButton}
              onPress={onOpenMenu}
            />
          }>
          <Menu.Item
            onPress={onFollow}
            titleStyle={styles.menuTitle}
            title={t('home:follow')}
          />
          <Menu.Item
            onPress={onReport}
            titleStyle={[styles.menuTitle, { color: theme.colors.error }]}
            title={t('home:report')}
          />
          <Divider />
          <Menu.Item
            onPress={onPromote}
            disabled={!feed.delegate}
            titleStyle={styles.menuTitle}
            title={t('home:promote')}
          />
        </Menu>
      </View>
    </View>
  );
}

const makeStyle = (insets: SafeAreaInsets, theme: Theme) =>
  StyleSheet.create({
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: wp('2%', insets),
      paddingHorizontal: wp('3%', insets),
      height: hp('7%', insets),
    },
    headerAvatarContainer: {
      justifyContent: 'center',
      width: wp('10%', insets),
      aspectRatio: 1,
      borderRadius: wp('5%', insets),
      overflow: 'hidden',
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
    menuTitle: {
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: theme.fonts.regular.fontWeight,
      fontSize: wp('4.0%', insets),
    },
  });
