import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import React from 'react';
import { NFT } from 'enevti-types/chain/nft';
import { wp, hp } from 'enevti-app/utils/layout/imageRatio';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppNFTRenderer from './AppNFTRenderer';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import { numberKMB, parseAmount } from 'enevti-app/utils/format/amount';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import Color from 'color';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import useDebouncedNavigation from 'enevti-app/utils/hook/useDebouncedNavigation';

interface AppNFTCardProps {
  nft: NFT;
  width: number;
  style?: StyleProp<ViewStyle>;
  navigation?: StackNavigationProp<RootStackParamList>;
}

export default function AppNFTCard({ nft, width, style, navigation }: AppNFTCardProps) {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  const nftWidth = React.useMemo(() => width - wp('1%'), [width]);
  const dnavigation = useDebouncedNavigation(navigation);

  const onNavigate = React.useCallback(
    () => (navigation ? dnavigation('NFTDetails', { arg: nft.id, mode: 'id' }) : undefined),
    [navigation, dnavigation, nft.id],
  );

  return (
    <View style={[style, { width: width }]}>
      <View style={[styles.container]}>
        <AppNFTRenderer imageSize={'m'} nft={nft} width={nftWidth} />
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
                name={nft.liked ? iconMap.likeActive : iconMap.likeInactive}
                size={10}
                color={nft.liked ? theme.colors.primary : theme.colors.text}
              />{' '}
              {numberKMB(nft.like, 2, true, ['K', 'M', 'B'], 10000)}
            </AppTextHeading4>
          )}
        </View>
        {navigation ? (
          <TouchableRipple style={styles.rippleOverlay} onPress={onNavigate}>
            <View />
          </TouchableRipple>
        ) : null}
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: wp('0.5%'),
      marginBottom: wp('1%'),
      paddingTop: hp('2%'),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
    },
    collectionName: {
      color: theme.colors.placeholder,
      marginTop: hp('1%'),
      marginHorizontal: wp('3%'),
    },
    collectionSerial: {
      marginHorizontal: wp('3%'),
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: hp('1%'),
      marginHorizontal: wp('3%'),
    },
    utility: {
      flex: 1,
      color: theme.colors.placeholder,
    },
    currency: {
      textAlignVertical: 'center',
    },
    rippleOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
  });
