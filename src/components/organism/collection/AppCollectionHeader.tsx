import { View, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider, TouchableRipple, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { DimensionFunction } from 'enevti-app/utils/imageRatio';
import { Collection } from 'enevti-app/types/service/enevti/collection';
import AppNetworkImage from 'enevti-app/components/atoms/image/AppNetworkImage';
import { IPFStoURL } from 'enevti-app/service/ipfs';
import AppCollectionMintingAvailable from './AppCollectionMintingAvailable';
import AppTextHeading2 from 'enevti-app/components/atoms/text/AppTextHeading2';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import { numberKMB, parseAmount } from 'enevti-app/utils/format/amount';
import AppIconComponent, {
  iconMap,
} from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppCollectionDescriptionModal from './AppCollectionDescriptionModal';
import { MINTING_AVAILABLE_VIEW_HEIGHT } from './AppCollectionMintingAvailable';
import useDimension from 'enevti-app/utils/hook/useDimension';
import AppPersonaLabel from 'enevti-app/components/molecules/avatar/AppPersonaLabel';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export const COLLECTION_HEADER_VIEW_HEIGHT =
  53 + (getStatusBarHeight() / Dimensions.get('window').height) * 100;

interface AppCollectionHeaderProps {
  collection: Collection;
  navigation: StackNavigationProp<RootStackParamList>;
  mintingAvailable: boolean;
  onFinish?: () => void;
}

export default function AppCollectionHeader({
  collection,
  navigation,
  mintingAvailable,
  onFinish,
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

  const onCreatorDetail = React.useCallback(() => {
    navigation.navigate('Profile', {
      arg: collection.creator.address,
    });
  }, [navigation, collection.creator.address]);

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
      pointerEvents={'box-none'}
      style={{
        backgroundColor: theme.colors.background,
        height: hp(totalHeight),
      }}>
      <View pointerEvents={'none'}>
        <AppNetworkImage
          url={IPFStoURL(collection.cover.cid)}
          style={{ width: coverWidth, height: coverHeight }}
        />
        {mintingAvailable ? (
          <AppCollectionMintingAvailable
            collection={collection}
            onFinish={onFinish}
          />
        ) : null}
      </View>
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
              persona={collection.creator}
              size={wp('5%')}
              style={{ marginHorizontal: wp('2%') }}
            />
            <AppPersonaLabel
              persona={collection.creator}
              style={styles.creatorAddress}
              onPress={onCreatorDetail}
            />
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
      paddingTop: wp('4%'),
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
