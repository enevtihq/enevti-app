import { View, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider, TouchableRipple, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { DimensionFunction } from 'enevti-app/utils/imageRatio';
import AppTextHeading2 from 'enevti-app/components/atoms/text/AppTextHeading2';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import { numberKMB } from 'enevti-app/utils/format/amount';
import AppIconComponent, {
  iconMap,
} from 'enevti-app/components/atoms/icon/AppIconComponent';
import useDimension from 'enevti-app/utils/hook/useDimension';
import AppPersonaLabel from 'enevti-app/components/molecules/avatar/AppPersonaLabel';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { NFT } from 'enevti-app/types/nft';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import { BlurView } from '@react-native-community/blur';
import NFTData from 'enevti-app/components/atoms/nft/data/NFTData';

export const NFT_DETAILS_HEADER_VIEW_HEIGHT =
  53 + (getStatusBarHeight() / Dimensions.get('window').height) * 100;

interface AppNFTDetailsHeaderProps {
  nft: NFT;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppNFTDetailsHeader({
  nft,
  navigation,
}: AppNFTDetailsHeaderProps) {
  const { t } = useTranslation();
  const { hp, wp } = useDimension();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(hp, wp), [hp, wp]);
  const [descriptionVisible, setDescriptionVisible] =
    React.useState<boolean>(false);

  const nftContainerPaddingTop = React.useMemo(
    () => insets.top + hp(HEADER_HEIGHT_PERCENTAGE),
    [insets.top, hp],
  );
  const nftWidth = React.useMemo(() => wp('80%'), [wp]);
  const nftContainerWidth = React.useMemo(() => wp('100%'), [wp]);
  const nftContainerHeight = React.useMemo(
    () => nftContainerWidth + nftContainerPaddingTop,
    [nftContainerWidth, nftContainerPaddingTop],
  );
  const totalHeight = React.useMemo(() => NFT_DETAILS_HEADER_VIEW_HEIGHT, []);

  const onCreatorDetail = React.useCallback(() => {
    navigation.navigate('Profile', {
      address: nft.creator.address,
    });
  }, [navigation, nft.creator.address]);

  const onOwnerDetail = React.useCallback(() => {
    navigation.navigate('Profile', {
      address: nft.owner.address,
    });
  }, [navigation, nft.owner.address]);

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
      <View
        pointerEvents={'none'}
        style={[
          styles.overflowHidden,
          {
            width: nftContainerWidth,
            height: nftContainerHeight - wp('7.5%'),
          },
        ]}>
        <View style={styles.nftBackground}>
          <NFTData
            nft={nft}
            args={{
              x: '0%',
              y: '0%',
              width: '100%',
              height: '100%',
              rotate: '0deg',
            }}
          />
        </View>
        <BlurView
          style={styles.absolute}
          blurType={theme.dark ? 'dark' : 'light'}
          blurAmount={10}
          reducedTransparencyFallbackColor={theme.colors.background}
        />
        <View
          style={{
            padding: wp('10%'),
            paddingTop: nftContainerPaddingTop + wp('2.5%'),
          }}>
          <AppNFTRenderer nft={nft} width={nftWidth} />
        </View>
      </View>
      <View>
        <TouchableRipple onPress={descriptionModalOnPress}>
          <View>
            <View style={styles.collectionName}>
              <View style={styles.collectionNameItem}>
                <AppTextHeading2>
                  {nft.symbol}#{nft.serial}
                </AppTextHeading2>

                <View style={styles.summary}>
                  <AppTextBody4 style={{ color: theme.colors.placeholder }}>
                    Super Rare · 0.04%
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

            <View
              style={{
                marginTop: hp('1%'),
                paddingHorizontal: wp('5%'),
              }}
            />
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
              {numberKMB(nft.like, 2)}
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
              {numberKMB(nft.comment, 2)}
            </AppTextBody4>
          </AppQuaternaryButton>
        </View>

        <View style={{ paddingHorizontal: wp('5%') }}>
          <Divider />
          <View style={styles.createdOwnedBy}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              Created By{' '}
            </AppTextBody4>
            <AppAvatarRenderer
              photo={nft.creator.photo}
              address={nft.creator.address}
              size={wp('5%')}
              style={{ marginHorizontal: wp('2%') }}
            />
            <AppPersonaLabel
              persona={nft.creator}
              style={styles.creatorOwnerAddress}
              onPress={onCreatorDetail}
            />
          </View>
          <Divider />
          <View style={styles.createdOwnedBy}>
            <AppTextBody4 style={{ color: theme.colors.placeholder }}>
              Owned By{' '}
            </AppTextBody4>
            <AppAvatarRenderer
              photo={nft.owner.photo}
              address={nft.owner.address}
              size={wp('5%')}
              style={{ marginHorizontal: wp('2%') }}
            />
            <AppPersonaLabel
              persona={nft.owner}
              style={styles.creatorOwnerAddress}
              onPress={onOwnerDetail}
            />
          </View>
          <Divider />
        </View>
      </View>
      {/* <AppCollectionDescriptionModal
        nft={nft}
        visible={descriptionVisible}
        onDismiss={descriptionModalOnDismiss}
      /> */}
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
    createdOwnedBy: {
      marginVertical: hp('1.5%'),
      flexDirection: 'row',
      alignItems: 'center',
    },
    summary: {
      marginTop: hp('0.5%'),
      flexDirection: 'row',
      alignItems: 'center',
    },
    creatorOwnerAddress: {
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
    absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    overflowHidden: {
      overflow: 'hidden',
    },
    nftBackground: {
      opacity: 0.5,
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
  });
