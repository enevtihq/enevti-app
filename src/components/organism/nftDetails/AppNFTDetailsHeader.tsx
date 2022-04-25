import { View, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import useDimension from 'enevti-app/utils/hook/useDimension';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import { BlurView } from '@react-native-community/blur';
import NFTData from 'enevti-app/components/atoms/nft/data/NFTData';
import { NFT } from 'enevti-app/types/core/chain/nft';

export const NFT_DETAILS_HEADER_VIEW_HEIGHT =
  53 + (getStatusBarHeight() / Dimensions.get('window').height) * 100;

interface AppNFTDetailsHeaderProps {
  nft: NFT;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppNFTDetailsHeader({ nft }: AppNFTDetailsHeaderProps) {
  const { hp, wp } = useDimension();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);

  const nftContainerPaddingTop = React.useMemo(
    () => insets.top + hp(HEADER_HEIGHT_PERCENTAGE),
    [insets.top, hp],
  );
  const nftWidth = React.useMemo(() => wp('80%'), [wp]);
  const nftContainerWidth = React.useMemo(() => wp('100%'), [wp]);
  const totalHeight = React.useMemo(() => NFT_DETAILS_HEADER_VIEW_HEIGHT, []);

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
            height: hp(totalHeight),
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
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
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
