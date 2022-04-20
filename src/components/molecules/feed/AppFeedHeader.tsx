import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCoinName } from 'enevti-app/components/atoms/brand/AppBrandConstant';
import { useTranslation } from 'react-i18next';
import { FeedItem } from 'enevti-app/types/core/service/feed';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { Divider, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppMenuItem from 'enevti-app/components/atoms/menu/AppMenuItem';
import { menuItemHeigtPercentage } from 'enevti-app/utils/layout/menuItemHeigtPercentage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppPersonaLabel from 'enevti-app/components/molecules/avatar/AppPersonaLabel';

interface AppFeedHeaderProps {
  feed: FeedItem;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppFeedHeader({
  feed,
  navigation,
}: AppFeedHeaderProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  const onProfileDetail = React.useCallback(() => {
    navigation.push('Profile', { arg: feed.owner.address, mode: 'a' });
  }, [navigation, feed.owner]);

  const onPromoteInfo = () => {};

  const onStake = React.useCallback(() => {
    navigation.push('StakePool', { arg: feed.owner.address, mode: 'a' });
  }, [navigation, feed.owner]);

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
      <AppAvatarRenderer persona={feed.owner} size={wp('10%', insets)} />

      <View style={styles.headerAvatarInfoContainer}>
        <AppPersonaLabel
          persona={feed.owner}
          textComponent={AppTextHeading3}
          onPress={onProfileDetail}
          style={styles.headerAction}
        />
        {feed.promoted ? (
          <Pressable onPress={onPromoteInfo} style={styles.headerAction}>
            <AppTextBody5 numberOfLines={1}>
              {t('home:promotedByCommunity')}
            </AppTextBody5>
          </Pressable>
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

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    headerAction: {
      flex: 1,
    },
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
      marginRight: -wp('1%', insets),
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
