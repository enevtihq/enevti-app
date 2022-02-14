import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppNetworkImage from '../../atoms/image/AppNetworkImage';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppTextBody5 from '../../atoms/text/AppTextBody5';
import AppQuaternaryButton from '../../atoms/button/AppQuaternaryButton';
import AppIconButton from '../../atoms/icon/AppIconButton';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCoinName } from '../../atoms/brand/AppBrandConstant';
import { useTranslation } from 'react-i18next';
import { HomeFeedItemResponse } from '../../../types/service/homeFeedItem';
import Avatar from '../../atoms/avatar';

interface AppFeedHeaderProps {
  feed: HomeFeedItemResponse;
}

export default function AppFeedHeader({ feed }: AppFeedHeaderProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets);

  const onStake = () => {};

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerAvatarContainer}>
        <View style={styles.headerAvatar}>
          {feed.photo ? (
            <AppNetworkImage style={styles.avatar} url={feed.photo} />
          ) : (
            <Avatar address={feed.owner} />
          )}
        </View>
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

      <View style={styles.headerPoolContainer}>
        <AppQuaternaryButton
          box
          style={styles.stakeButton}
          onPress={() => onStake()}>
          <View style={styles.stakeButtonContainer}>
            <AppTextHeading3 style={styles.headerPoolText}>
              {feed.stake}
            </AppTextHeading3>
            <AppTextBody5 style={styles.headerPoolText}>
              {getCoinName()}
            </AppTextBody5>
          </View>
        </AppQuaternaryButton>
      </View>

      <View style={styles.headerMoreButtonContainer}>
        <AppIconButton
          icon={iconMap.dots}
          size={wp('5%', insets)}
          style={styles.headerMoreButton}
          onPress={() => console.log('more')}
        />
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
    },
    headerAvatarContainer: {
      justifyContent: 'center',
    },
    headerAvatar: {
      width: wp('10%', insets),
      aspectRatio: 1,
      borderRadius: wp('5%', insets),
      overflow: 'hidden',
    },
    headerAvatarInfoContainer: {
      flex: 1,
      justifyContent: 'center',
      marginLeft: wp('2%', insets),
    },
    headerPoolContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: wp('2%', insets),
      paddingVertical: '1%',
      width: wp('30%', insets),
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
    stakeButton: {
      height: '100%',
      width: '100%',
    },
    stakeButtonContainer: {
      width: '100%',
    },
  });
