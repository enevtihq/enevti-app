import { Platform, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { Divider, useTheme } from 'react-native-paper';
import AppTextHeading2 from 'enevti-app/components/atoms/text/AppTextHeading2';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppNFTDetailsRedeemBar from '../AppNFTDetailsRedeemBar';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import { numberKMB } from 'enevti-app/utils/format/amount';
import AppAvatarRenderer from 'enevti-app/components/molecules/avatar/AppAvatarRenderer';
import AppPersonaLabel from 'enevti-app/components/molecules/avatar/AppPersonaLabel';
import useDimension from 'enevti-app/utils/hook/useDimension';
import { Theme } from 'enevti-app/theme/default';
import { DimensionFunction, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import Animated from 'react-native-reanimated';
import { NFT_DETAILS_TOP_TABBAR_HEIGHT_PERCENTAGE } from '../AppNFTDetailsBody';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AppAccordion from 'enevti-app/components/atoms/accordion/AppAccordion';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import Color from 'color';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { NFT } from 'enevti-app/types/core/chain/nft';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { useDispatch } from 'react-redux';

interface NFTSummaryComponentProps {
  nft: NFT;
  navigation: StackNavigationProp<RootStackParamList>;
  onScroll?: any;
  collectionHeaderHeight?: any;
  onMounted?: () => void;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
}

function Component(
  { nft, navigation, onScroll, collectionHeaderHeight, onMounted, onRefresh, scrollEnabled }: NFTSummaryComponentProps,
  ref: any,
) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { hp, wp } = useDimension();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;

  const mounted = React.useRef<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const styles = React.useMemo(
    () => makeStyles(hp, wp, displayed, collectionHeaderHeight, insets, theme),
    [hp, wp, displayed, collectionHeaderHeight, insets, theme],
  );
  const isScrollEnabled = React.useMemo(() => (refreshing ? false : scrollEnabled), [refreshing, scrollEnabled]);

  const progressViewOffset = React.useMemo(
    () => (Platform.OS === 'ios' ? 0 : hp(NFT_DETAILS_TOP_TABBAR_HEIGHT_PERCENTAGE) + collectionHeaderHeight),
    [collectionHeaderHeight, hp],
  );

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    onRefresh && onRefresh();
    if (mounted.current) {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const refreshControl = React.useMemo(
    () => <RefreshControl refreshing={false} onRefresh={handleRefresh} progressViewOffset={progressViewOffset} />,
    [handleRefresh, progressViewOffset],
  );

  const onCreatorDetail = React.useCallback(() => {
    navigation.push('Profile', {
      arg: nft.creator.address,
      mode: 'a',
    });
  }, [navigation, nft.creator.address]);

  const onOwnerDetail = React.useCallback(() => {
    navigation.push('Profile', {
      arg: nft.owner.address,
      mode: 'a',
    });
  }, [navigation, nft.owner.address]);

  React.useEffect(() => {
    if (ref && ref.current) {
      mounted.current = true;
      setDisplayed(true);
      onMounted && onMounted();
    }
    return function cleanup() {
      mounted.current = false;
    };
  }, [ref, onMounted, refreshing]);

  return (
    <Animated.ScrollView
      ref={ref}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      onMomentumScrollEnd={() => {}}
      refreshControl={refreshControl}
      contentContainerStyle={styles.contentContainerStyle}
      scrollEnabled={isScrollEnabled}>
      <View>
        <View style={styles.nftDetailsName}>
          <View style={styles.nftDetailsNameItem}>
            <AppTextHeading2>
              {nft.symbol}#{nft.serial}
            </AppTextHeading2>

            <View style={styles.summary}>
              <AppTextBody4 style={{ color: theme.colors.placeholder }}>{nft.name}</AppTextBody4>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: hp('1%'),
            paddingHorizontal: wp('5%'),
          }}
        />
      </View>

      <AppNFTDetailsRedeemBar nft={nft} />

      <View style={styles.nftDetailsChipsContainer}>
        <AppQuaternaryButton
          icon={iconMap.likeActive}
          iconSize={hp('3%')}
          iconColor={theme.colors.placeholder}
          style={{
            height: hp('4%'),
          }}
          onPress={() => dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }))}>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>{numberKMB(nft.like, 2)}</AppTextBody4>
        </AppQuaternaryButton>
        <AppQuaternaryButton
          icon={iconMap.commentFill}
          iconSize={hp('3%')}
          iconColor={theme.colors.placeholder}
          style={{
            height: hp('4%'),
          }}
          onPress={() => dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }))}>
          <AppTextBody4 style={{ color: theme.colors.placeholder }}>{numberKMB(nft.comment, 2)}</AppTextBody4>
        </AppQuaternaryButton>
      </View>

      <View style={{ paddingHorizontal: wp('5%') }}>
        <Divider />
        <View style={styles.createdOwnedBy}>
          <AppTextBody4 style={{ color: theme.colors.placeholder, width: wp('20%') }}>
            {t('nftDetails:createdBy')}{' '}
          </AppTextBody4>
          <AppAvatarRenderer persona={nft.creator} size={wp('5%')} style={{ marginHorizontal: wp('2%') }} />
          <AppPersonaLabel persona={nft.creator} style={styles.creatorOwnerAddress} onPress={onCreatorDetail} />
        </View>
        <Divider />
        <View style={styles.createdOwnedBy}>
          <AppTextBody4 style={{ color: theme.colors.placeholder, width: wp('20%') }}>
            {t('nftDetails:ownedBy')}{' '}
          </AppTextBody4>
          <AppAvatarRenderer persona={nft.owner} size={wp('5%')} style={{ marginHorizontal: wp('2%') }} />
          <AppPersonaLabel persona={nft.owner} style={styles.creatorOwnerAddress} onPress={onOwnerDetail} />
        </View>
        <Divider />
      </View>
      <View style={styles.accordionContainer}>
        <View style={styles.accordionBox}>
          <AppAccordion
            title={<AppTextBody3>{t('nftDetails:collectionDetail')}</AppTextBody3>}
            titleStyle={styles.accordionTitle}>
            <View style={styles.accordionItem}>
              <Pressable
                style={styles.collectionDetail}
                onPress={() =>
                  navigation.push('Collection', {
                    arg: nft.collectionId,
                    mode: 'id',
                  })
                }>
                <AppTextHeading3>{nft.name}</AppTextHeading3>
              </Pressable>
              <AppTextBody4>{nft.description}</AppTextBody4>
            </View>
          </AppAccordion>
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const makeStyles = (
  hp: DimensionFunction,
  wp: DimensionFunction,
  displayed: boolean,
  collectionHeaderHeight: number,
  insets: SafeAreaInsets,
  theme: Theme,
) =>
  StyleSheet.create({
    contentContainerStyle: {
      paddingTop: hp(NFT_DETAILS_TOP_TABBAR_HEIGHT_PERCENTAGE) + collectionHeaderHeight,
      minHeight:
        hp(100) +
        collectionHeaderHeight -
        hp(HEADER_HEIGHT_PERCENTAGE) -
        (Platform.OS === 'ios' ? insets.top * 0.9 : 0),
      display: displayed ? undefined : 'none',
    },
    collectionDetail: {
      paddingBottom: hp('1%'),
    },
    accordionTitle: {
      marginLeft: -wp('2%'),
    },
    accordionBox: {
      borderRadius: theme.roundness,
      overflow: 'hidden',
      borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
      borderWidth: StyleSheet.hairlineWidth,
      marginHorizontal: wp('5%'),
    },
    accordionContainer: {
      marginTop: hp('5%'),
    },
    accordionItem: {
      paddingHorizontal: wp('3%'),
      paddingBottom: hp('2%'),
      backgroundColor: theme.colors.background,
    },
    nftDetailsName: {
      flexDirection: 'row',
      paddingTop: wp('4%'),
      paddingHorizontal: wp('5%'),
    },
    nftDetailsNameItem: {
      flex: 1,
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
    nftDetailsChipsContainer: {
      height: hp('3%'),
      paddingHorizontal: wp('5%'),
      marginTop: hp('1.5%'),
      marginBottom: hp('2%'),
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

const NFTSummaryComponent = React.forwardRef(Component);
export default NFTSummaryComponent;
