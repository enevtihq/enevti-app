import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { useTranslation } from 'react-i18next';
import { FeedItem } from 'enevti-types/service/feed';
import AppTextHeading5 from 'enevti-app/components/atoms/text/AppTextHeading5';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import moment from 'moment';

interface AppFeedFooterProps {
  feed: FeedItem;
}

export default function AppFeedFooter({ feed }: AppFeedFooterProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.footerContainer}>
      <Text numberOfLines={2} style={styles.description}>
        <AppTextHeading4>{feed.name}</AppTextHeading4>
        <AppTextHeading4> | </AppTextHeading4>
        <AppTextBody4>{feed.description}</AppTextBody4>
      </Text>
      <Text>
        <AppTextHeading5 style={styles.tag}>
          {feed.type === 'onekind' ? t('home:oneKind') : feed.type === 'packed' ? t('home:pack') : 'NFT'}
        </AppTextHeading5>
        <AppTextBody5 style={styles.tag}> | </AppTextBody5>
        {feed.type !== 'nft' ? (
          <Text>
            <AppTextBody5 style={styles.tag}>
              {t('home:mintingProgress', { minted: feed.minted, total: feed.total })}
            </AppTextBody5>
            <AppTextBody5 style={styles.tag}> | </AppTextBody5>
            <AppTextBody5 style={styles.tag}>
              {feed.expire !== 0 ? t('home:expire', { msg: moment(feed.expire).fromNow() }) : t('home:noExpire')}
            </AppTextBody5>
          </Text>
        ) : null}
      </Text>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    footerContainer: {
      paddingHorizontal: wp('3%'),
      paddingBottom: wp('3%'),
      height: hp('10%'),
    },
    tag: {
      color: theme.colors.primary,
    },
    description: {
      marginBottom: wp('2%'),
    },
  });
