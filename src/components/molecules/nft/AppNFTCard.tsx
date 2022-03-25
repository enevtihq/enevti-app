import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import React from 'react';
import { NFTBase } from '../../../types/nft';
import { wp, SafeAreaInsets, hp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';
import AppNFTRenderer from './AppNFTRenderer';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppTextHeading4 from '../../atoms/text/AppTextHeading4';
import { parseAmount } from '../../../utils/format/amount';
import AppTextBody5 from '../../atoms/text/AppTextBody5';
import AppIconComponent, { iconMap } from '../../atoms/icon/AppIconComponent';
import Color from 'color';

interface AppNFTCardProps {
  nft: NFTBase;
  width: number;
  style?: StyleProp<ViewStyle>;
}

export default function AppNFTCard({ nft, width, style }: AppNFTCardProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyle(theme, insets), [theme, insets]);
  const nftWidth = React.useMemo(
    () => width - wp('2%', insets),
    [width, insets],
  );

  return (
    <View style={[style, { width: width }]}>
      <View style={[styles.container]}>
        <AppNFTRenderer nft={nft} width={nftWidth} />
        <AppTextBody4 numberOfLines={1} style={styles.collectionName}>
          {nft.name}
        </AppTextBody4>
        <AppTextHeading3 numberOfLines={1} style={styles.collectionSerial}>
          {nft.symbol}#{nft.serial}
        </AppTextHeading3>
        <View style={styles.footer}>
          <AppTextBody5 numberOfLines={1} style={styles.utility}>
            {nft.utility}
          </AppTextBody5>
          {nft.onSale ? (
            <AppTextHeading4 numberOfLines={1}>
              {parseAmount(nft.price.amount, false, 2)}{' '}
              <AppTextBody5 numberOfLines={1} style={styles.currency}>
                ${nft.price.currency}
              </AppTextBody5>
            </AppTextHeading4>
          ) : (
            <AppTextHeading4 numberOfLines={1}>
              <AppIconComponent
                name={iconMap.likeInactive}
                size={10}
                color={theme.colors.text}
              />{' '}
              {nft.like}
            </AppTextHeading4>
          )}
        </View>
      </View>
    </View>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      marginHorizontal: wp('1%', insets),
      marginBottom: wp('2%', insets),
      paddingTop: hp('2%', insets),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
    },
    collectionName: {
      color: theme.colors.placeholder,
      marginTop: hp('1%', insets),
      marginHorizontal: wp('3%', insets),
    },
    collectionSerial: {
      marginHorizontal: wp('3%', insets),
    },
    footer: {
      flexDirection: 'row',
      marginVertical: hp('1%', insets),
      marginHorizontal: wp('3%', insets),
    },
    utility: {
      flex: 1,
      color: theme.colors.placeholder,
    },
    currency: {
      textAlignVertical: 'center',
    },
  });
