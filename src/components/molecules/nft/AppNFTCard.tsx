import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import React from 'react';
import { NFTBase } from 'enevti-app/types/nft';
import { wp, SafeAreaInsets, hp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppNFTRenderer from './AppNFTRenderer';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import { parseAmount } from 'enevti-app/utils/format/amount';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppIconComponent, {
  iconMap,
} from 'enevti-app/components/atoms/icon/AppIconComponent';
import Color from 'color';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

interface AppNFTCardProps {
  nft: NFTBase;
  width: number;
  style?: StyleProp<ViewStyle>;
  navigation?: StackNavigationProp<RootStackParamList>;
}

export default function AppNFTCard({
  nft,
  width,
  style,
  navigation,
}: AppNFTCardProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );
  const nftWidth = React.useMemo(
    () => width - wp('1%', insets),
    [width, insets],
  );

  const onNavigate = React.useCallback(
    () =>
      navigation ? navigation.push('NFTDetails', { arg: nft.id }) : undefined,
    [navigation, nft.id],
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
        {navigation ? (
          <TouchableRipple style={styles.rippleOverlay} onPress={onNavigate}>
            <View />
          </TouchableRipple>
        ) : null}
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      marginHorizontal: wp('0.5%', insets),
      marginBottom: wp('1%', insets),
      paddingTop: hp('2%', insets),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      overflow: 'hidden',
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
      alignItems: 'center',
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
    rippleOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
  });
