import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider, TouchableRipple, useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';
import { DimensionFunction } from '../../../utils/imageRatio';
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
import { MINTING_AVAILABLE_VIEW_HEIGHT } from './AppCollectionMintingAvailable';
import useDimension from 'enevti-app/utils/hook/useDimension';

export const COLLECTION_HEADER_VIEW_HEIGHT = 55;

interface AppCollectionHeaderProps {
  collection: Collection;
  mintingAvailable: boolean;
}

export default function AppCollectionHeader({
  collection,
  mintingAvailable,
}: AppCollectionHeaderProps) {
  const { t } = useTranslation();
  const { hp, wp } = useDimension();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(hp, wp), [hp, wp]);
  const [descriptionVisible, setDescriptionVisible] =
    React.useState<boolean>(false);

  const coverWidth = React.useMemo(() => wp('100%'), [wp]);
  const coverHeight = React.useMemo(
    () => insets.top + coverWidth * 0.5625,
    [coverWidth, insets],
  );
  const totalHeight = React.useMemo(
    () =>
      COLLECTION_HEADER_VIEW_HEIGHT +
      (mintingAvailable ? MINTING_AVAILABLE_VIEW_HEIGHT : 0),
    [mintingAvailable],
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
      style={{
        backgroundColor: theme.colors.background,
        height: hp(totalHeight),
      }}>
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
                marginTop: hp('1%'),
                paddingHorizontal: wp('5%'),
              }}
              numberOfLines={1}>
              {collection.description}
            </AppTextBody4>
          </View>
        </TouchableRipple>

        <View style={styles.collectionChipsContainer}>
          <AppQuaternaryButton
            icon={iconMap.likeActive}
            iconSize={hp('3%')}
            iconColor={theme.colors.placeholder}
            style={{
              height: hp('4%'),
            }}
            onPress={() => console.log('Pressed')}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {numberKMB(collection.like, 2)}
            </AppTextBody4>
          </AppQuaternaryButton>
          <AppQuaternaryButton
            icon={iconMap.commentFill}
            iconSize={hp('3%')}
            iconColor={theme.colors.placeholder}
            style={{
              height: hp('4%'),
            }}
            onPress={() => console.log('Pressed')}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {numberKMB(collection.comment, 2)}
            </AppTextBody4>
          </AppQuaternaryButton>
          <AppQuaternaryButton
            icon={iconMap.twitter}
            iconSize={hp('3%')}
            iconColor={theme.colors.placeholder}
            style={{
              height: hp('4%'),
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

        <View style={{ paddingHorizontal: wp('5%') }}>
          <Divider />
          <View style={styles.createdBy}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              {t('collection:createdBy')}{' '}
            </AppTextBody4>
            <AppAvatarRenderer
              photo={collection.originAddress.photo}
              address={collection.originAddress.address}
              size={wp('5%')}
              style={{ marginHorizontal: wp('2%') }}
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

const makeStyles = (hp: DimensionFunction, wp: DimensionFunction) =>
  StyleSheet.create({
    collectionName: {
      flexDirection: 'row',
      paddingTop: wp('2%'),
      paddingHorizontal: wp('5%'),
    },
    collectionNameItem: {
      flex: 1,
    },
    collectionNameDropdown: {
      alignSelf: 'center',
    },
    createdBy: {
      marginVertical: hp('1.5%'),
      flexDirection: 'row',
      alignItems: 'center',
    },
    summary: {
      marginTop: hp('0.5%'),
      flexDirection: 'row',
      alignItems: 'center',
    },
    creatorAddress: {
      flex: 1,
      height: '100%',
    },
    collectionChipsContainer: {
      height: hp('3%'),
      paddingHorizontal: wp('5%'),
      marginVertical: hp('2%'),
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
