import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import Color from 'color';
import { Collection } from '../../../types/service/enevti/collection';
import AppNetworkImage from '../../atoms/image/AppNetworkImage';
import { IPFStoURL } from '../../../service/ipfs';
import AppCollectionMintingAvailable from './AppCollectionMintingAvailable';
import AppTextHeading2 from '../../atoms/text/AppTextHeading2';
import AppTextBody3 from '../../atoms/text/AppTextBody3';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import AppAvatarRenderer from '../../molecules/avatar/AppAvatarRenderer';
import AppTextHeading4 from '../../atoms/text/AppTextHeading4';
import AppQuaternaryButton from '../../atoms/button/AppQuaternaryButton';
import { numberKMB, parseAmount } from '../../../utils/format/amount';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppCurrencyIcon from '../../atoms/icon/AppCurrencyIcon';
import Animated from 'react-native-reanimated';

interface AppCollectionHeaderProps {
  collection: Collection;
  onLayout?: (e: LayoutChangeEvent) => void;
}

export default function AppCollectionHeader({
  collection,
  onLayout,
}: AppCollectionHeaderProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const now = React.useMemo(() => Date.now(), []);

  const mintingAvailable = React.useMemo(
    () =>
      collection.minting.expire <= now || collection.minting.available === 0
        ? false
        : true,
    [collection.minting.expire, collection.minting.available, now],
  );

  const coverWidth = React.useMemo(() => wp('100%', insets), [insets]);
  const coverHeight = React.useMemo(
    () => insets.top + coverWidth * 0.5625,
    [coverWidth, insets],
  );

  return (
    <Animated.View
      onLayout={onLayout}
      style={{ backgroundColor: theme.colors.background }}>
      <AppNetworkImage
        url={IPFStoURL(collection.cover)}
        style={{ width: coverWidth, height: coverHeight }}
      />
      {mintingAvailable ? (
        <AppCollectionMintingAvailable collection={collection} />
      ) : null}
      <View
        style={{
          paddingHorizontal: wp('5%', insets),
          paddingVertical: hp('2%', insets),
        }}>
        <AppTextHeading2>
          {collection.name}{' '}
          <AppTextBody3 style={{ color: theme.colors.placeholder }}>
            ({collection.symbol})
          </AppTextBody3>
        </AppTextHeading2>

        <View style={styles.createdBy}>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>
            {t('collection:createdBy')}{' '}
          </AppTextBody4>
          <AppAvatarRenderer
            photo={collection.originAddress.photo}
            address={collection.originAddress.address}
            size={wp('5%', insets)}
            style={{ marginHorizontal: wp('2%', insets) }}
          />
          <AppTextHeading4 numberOfLines={1} style={styles.creatorAddress}>
            {collection.originAddress.username
              ? collection.originAddress.username
              : collection.originAddress.address}
          </AppTextHeading4>
        </View>

        <AppTextBody4 readMoreLimit={95}>{collection.description}</AppTextBody4>

        <View style={styles.collectionChipsContainer}>
          <AppQuaternaryButton
            icon={iconMap.likeActive}
            iconSize={hp('3%', insets)}
            iconColor={theme.colors.placeholder}
            style={{
              height: hp('4%', insets),
            }}
            onPress={() => console.log('Pressed')}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {numberKMB(collection.like, 2)}
            </AppTextBody4>
          </AppQuaternaryButton>
          <AppQuaternaryButton
            icon={iconMap.commentFill}
            iconSize={hp('3%', insets)}
            iconColor={theme.colors.placeholder}
            style={{
              height: hp('4%', insets),
            }}
            onPress={() => console.log('Pressed')}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {numberKMB(collection.comment, 2)}
            </AppTextBody4>
          </AppQuaternaryButton>
          <AppQuaternaryButton
            icon={iconMap.twitter}
            iconSize={hp('3%', insets)}
            iconColor={theme.colors.placeholder}
            style={{
              height: hp('4%', insets),
            }}
            onPress={() => console.log('Pressed')}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {numberKMB(
                collection.social.twitter.stat
                  ? collection.social.twitter.stat
                  : 0,
                2,
              )}
            </AppTextBody4>
          </AppQuaternaryButton>
        </View>

        <View style={styles.collectionStatsContainer}>
          <View style={styles.collectionStatsItem}>
            <AppTextHeading3 numberOfLines={1}>
              {numberKMB(collection.stat.minted, 2)}
            </AppTextHeading3>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              {t('collection:statItem')}
            </AppTextBody4>
          </View>
          <View style={styles.collectionStatsDivider} />
          <View style={styles.collectionStatsItem}>
            <AppTextHeading3 numberOfLines={1}>
              {collection.stat.owner}
            </AppTextHeading3>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              {t('collection:statOwners')}
            </AppTextBody4>
          </View>
          <View style={styles.collectionStatsDivider} />
          <View style={styles.collectionStatsItem}>
            <View style={styles.collectionCurrency}>
              <AppCurrencyIcon
                currency={collection.stat.floor.currency}
                size={15}
                style={styles.collectionCurrencyIcon}
              />
              <AppTextHeading3 numberOfLines={1}>
                {parseAmount(collection.stat.floor.amount, true, 2)}
              </AppTextHeading3>
            </View>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              {t('collection:statFloorPrice')}
            </AppTextBody4>
          </View>
          <View style={styles.collectionStatsDivider} />
          <View style={styles.collectionStatsItem}>
            <AppTextHeading3 numberOfLines={1}>
              {collection.stat.redeemed}
            </AppTextHeading3>
            <AppTextBody4
              numberOfLines={1}
              style={{ color: theme.colors.placeholder }}>
              {t('collection:statRedeemed')}
            </AppTextBody4>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    createdBy: {
      marginBottom: hp('1.5%', insets),
      marginTop: hp('0.5%', insets),
      flexDirection: 'row',
      alignItems: 'center',
    },
    creatorAddress: {
      width: wp('40%', insets),
      height: '100%',
    },
    collectionStatsContainer: {
      flexDirection: 'row',
      marginVertical: hp('1%', insets),
      height: hp('5.2%', insets),
    },
    collectionStatsItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    collectionCurrency: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    collectionCurrencyIcon: {
      marginLeft: -5,
    },
    collectionStatsDivider: {
      height: '50%',
      alignSelf: 'center',
      borderWidth: 0.3,
      borderColor: Color(theme.colors.placeholder).alpha(0.1).rgb().toString(),
    },
    collectionChipsContainer: {
      height: hp('3%', insets),
      marginVertical: hp('2%', insets),
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
