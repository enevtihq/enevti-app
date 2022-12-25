import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { getCoinName } from 'enevti-app/utils/constant/identifier';
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
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { useDispatch } from 'react-redux';

interface AppFeedHeaderProps {
  feed: FeedItem;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppFeedHeader({ feed, navigation }: AppFeedHeaderProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  const onProfileDetail = React.useCallback(() => {
    if (feed.owner.address) {
      navigation.push('Profile', { arg: feed.owner.address, mode: 'a' });
    } else {
      dispatch(showSnackbar({ mode: 'info', text: t('error:dataUnavailable') }));
    }
  }, [navigation, feed.owner.address, dispatch, t]);

  const onPromoteInfo = () => {};

  const onStake = React.useCallback(() => {
    navigation.push('StakePool', { arg: feed.owner.address, mode: 'a' });
  }, [navigation, feed.owner]);

  const onOpenMenu = () => {
    setMenuVisible(true);
  };

  const onCloseMenu = () => {
    setMenuVisible(false);
  };

  const onFollow = () => {
    setMenuVisible(false);
    dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }));
  };

  const onReport = () => {
    setMenuVisible(false);
    dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }));
  };

  const onPromote = () => {
    setMenuVisible(false);
    dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }));
  };

  return (
    <View style={styles.headerContainer}>
      <AppAvatarRenderer persona={feed.owner} size={wp('10%')} />

      <View style={styles.headerAvatarInfoContainer}>
        <AppPersonaLabel
          persona={feed.owner}
          textComponent={AppTextHeading3}
          onPress={onProfileDetail}
          style={styles.headerAction}
        />
        {feed.promoted ? (
          <Pressable onPress={onPromoteInfo} style={styles.headerAction}>
            <AppTextBody5 numberOfLines={1}>{t('home:promotedByCommunity')}</AppTextBody5>
          </Pressable>
        ) : (
          <View />
        )}
      </View>

      <AppQuaternaryButton box style={styles.headerPoolContainer} onPress={() => onStake()}>
        <AppTextHeading3 style={styles.headerPoolText}>{parseAmount(feed.stake, true, 2)}</AppTextHeading3>
        <AppTextBody5 style={styles.headerPoolText}>{getCoinName()}</AppTextBody5>
      </AppQuaternaryButton>

      <View style={styles.headerMoreButtonContainer}>
        <AppMenuContainer
          tapEverywhereToDismiss
          visible={menuVisible}
          onDismiss={onCloseMenu}
          snapPoints={[`${menuItemHeigtPercentage(3)}%`]}
          anchor={
            <AppIconButton icon={iconMap.dots} size={wp('5%')} style={styles.headerMoreButton} onPress={onOpenMenu} />
          }>
          <AppMenuItem onPress={onFollow} title={t('home:follow')} />
          <AppMenuItem onPress={onReport} titleStyle={{ color: theme.colors.error }} title={t('home:report')} />
          <Divider />
          <AppMenuItem onPress={onPromote} disabled={!feed.delegate} title={t('home:promote')} />
        </AppMenuContainer>
      </View>
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    headerAction: {
      flex: 1,
      justifyContent: 'center',
    },
    headerContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: wp('2%'),
      paddingHorizontal: wp('3%'),
      height: hp('7%'),
    },
    headerAvatarInfoContainer: {
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: wp('2%'),
    },
    headerPoolContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: wp('30%'),
      height: '100%',
    },
    headerPoolText: {
      textAlign: 'center',
    },
    headerMoreButtonContainer: {
      justifyContent: 'center',
      marginRight: -wp('1%'),
      width: wp('8%'),
    },
    headerMoreButton: {
      width: wp('6%'),
    },
    avatar: {
      width: '100%',
      aspectRatio: 1,
    },
    stakeButtonContainer: {
      width: '100%',
    },
  });
