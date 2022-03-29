import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider, TouchableRipple, useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { Collection } from '../../../types/service/enevti/collection';
import AppNetworkImage from '../../atoms/image/AppNetworkImage';
import { IPFStoURL } from '../../../service/ipfs';
import AppCollectionMintingAvailable from './AppCollectionMintingAvailable';
import AppTextHeading2 from '../../atoms/text/AppTextHeading2';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import AppAvatarRenderer from '../../molecules/avatar/AppAvatarRenderer';
import AppTextHeading4 from '../../atoms/text/AppTextHeading4';
import AppQuaternaryButton from '../../atoms/button/AppQuaternaryButton';
import { numberKMB, parseAmount } from '../../../utils/format/amount';
import AppIconComponent, { iconMap } from '../../atoms/icon/AppIconComponent';
import AppCollectionDescriptionModal from './AppCollectionDescriptionModal';

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
  const [descriptionVisible, setDescriptionVisible] =
    React.useState<boolean>(false);

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

  const descriptionModalOnDismiss = React.useCallback(
    () => setDescriptionVisible(false),
    [],
  );

  const descriptionModalOnPress = React.useCallback(
    () => setDescriptionVisible(old => !old),
    [],
  );

  return (
    <View
      onLayout={onLayout}
      style={{ backgroundColor: theme.colors.background }}>
      <AppNetworkImage
        url={IPFStoURL(collection.cover)}
        style={{ width: coverWidth, height: coverHeight }}
      />
      {mintingAvailable ? (
        <AppCollectionMintingAvailable collection={collection} />
      ) : null}
      <View>
        <TouchableRipple onPress={descriptionModalOnPress}>
          <View>
            <View style={styles.collectionName}>
              <View style={styles.collectionNameItem}>
                <AppTextHeading2>{collection.name}</AppTextHeading2>

                <View style={styles.summary}>
                  <AppTextBody4 style={{ color: theme.colors.placeholder }}>
                    {`${collection.stat.minted} ${t(
                      'collection:statItem',
                    )} · ${t('collection:statFloorPrice')}: ${parseAmount(
                      collection.stat.floor.amount,
                      true,
                      2,
                    )} $${collection.stat.floor.currency}`}
                  </AppTextBody4>
                </View>
              </View>
              <AppIconComponent
                name={iconMap.dropDown}
                size={30}
                color={theme.colors.placeholder}
                style={styles.collectionNameDropdown}
              />
            </View>

            <AppTextBody4
              style={{
                marginTop: hp('1%', insets),
                paddingHorizontal: wp('5%', insets),
              }}
              numberOfLines={1}>
              {collection.description}
            </AppTextBody4>
          </View>
        </TouchableRipple>

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

        <View style={{ paddingHorizontal: wp('5%', insets) }}>
          <Divider />
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
          <Divider />
        </View>
      </View>
      <AppCollectionDescriptionModal
        collection={collection}
        visible={descriptionVisible}
        onDismiss={descriptionModalOnDismiss}
      />
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    collectionName: {
      flexDirection: 'row',
      paddingTop: wp('2%', insets),
      paddingHorizontal: wp('5%', insets),
    },
    collectionNameItem: {
      flex: 1,
    },
    collectionNameDropdown: {
      alignSelf: 'center',
    },
    createdBy: {
      marginVertical: hp('1.5%', insets),
      flexDirection: 'row',
      alignItems: 'center',
    },
    summary: {
      marginTop: hp('0.5%', insets),
      flexDirection: 'row',
      alignItems: 'center',
    },
    creatorAddress: {
      flex: 1,
      height: '100%',
    },
    collectionChipsContainer: {
      height: hp('3%', insets),
      paddingHorizontal: wp('5%', insets),
      marginVertical: hp('2%', insets),
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
