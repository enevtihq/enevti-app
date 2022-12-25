import { Dimensions, Platform, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
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
import { DimensionFunction, SafeAreaInsets } from 'enevti-app/utils/layout/imageRatio';
import Animated from 'react-native-reanimated';
import { NFT_DETAILS_TOP_TABBAR_HEIGHT_PERCENTAGE } from '../AppNFTDetailsBody';
import { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AppAccordion from 'enevti-app/components/atoms/accordion/AppAccordion';
import AppTextBody3 from 'enevti-app/components/atoms/text/AppTextBody3';
import Color from 'color';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootState } from 'enevti-app/store/state';
import {
  addNFTDetailsViewLike,
  selectNFTDetailsView,
  setNFTDetailsRender,
} from 'enevti-app/store/slices/ui/view/nftDetails';
import { directPayLikeNFT } from 'enevti-app/store/middleware/thunk/payment/direct/directPayLikeNFT';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import AppLikeReadyInstance from 'enevti-app/utils/app/likeReady';

interface NFTSummaryComponentProps {
  route: RouteProp<RootStackParamList, 'NFTDetails'>;
  navigation: StackNavigationProp<RootStackParamList>;
  onScroll?: any;
  onMomentumScroll?: any;
  collectionHeaderHeight?: any;
  onMounted?: () => void;
  onRefresh?: () => void;
  scrollEnabled?: boolean;
}

function Component(
  {
    route,
    navigation,
    onScroll,
    collectionHeaderHeight,
    onMounted,
    onMomentumScroll,
    onRefresh,
    scrollEnabled,
  }: NFTSummaryComponentProps,
  ref: any,
) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { hp, wp } = useDimension();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;

  const mounted = React.useRef<boolean>(false);
  const likeThunkRef = React.useRef<any>();
  const [likeLoading, setLikeLoading] = React.useState<boolean>(false);
  const [displayed, setDisplayed] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const nft = useSelector((state: RootState) => selectNFTDetailsView(state, route.key));

  useFocusEffect(
    React.useCallback(() => {
      if (!nft.render.summary) {
        dispatch(setNFTDetailsRender({ key: route.key, value: { summary: true } }));
      }
    }, [dispatch, nft.render.summary, route.key]),
  );

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

  const onLikeActivate = React.useCallback(async () => {
    setLikeLoading(true);
    likeThunkRef.current = dispatch(
      directPayLikeNFT({ id: nft.id, key: route.key, symbol: nft.symbol, serial: nft.serial }),
    );
  }, [dispatch, nft.id, nft.symbol, nft.serial, route.key]);

  const onLikeDeactivate = React.useCallback(() => {
    dispatch(showSnackbar({ mode: 'info', text: t('home:cannotLike') }));
  }, [dispatch, t]);

  const onCreatorDetail = React.useCallback(() => {
    if (nft.creator.address) {
      navigation.push('Profile', {
        arg: nft.creator.address,
        mode: 'a',
      });
    } else {
      dispatch(showSnackbar({ mode: 'info', text: t('error:dataUnavailable') }));
    }
  }, [dispatch, navigation, nft.creator.address, t]);

  const onOwnerDetail = React.useCallback(() => {
    if (nft.owner.address) {
      navigation.push('Profile', {
        arg: nft.owner.address,
        mode: 'a',
      });
    } else {
      dispatch(showSnackbar({ mode: 'info', text: t('error:dataUnavailable') }));
    }
  }, [dispatch, t, navigation, nft.owner.address]);

  const paymentIdleCallback = React.useCallback((paymentStatus: PaymentStatus) => {
    if (paymentStatus.action === 'likeNFT') {
      setLikeLoading(false);
      likeThunkRef.current?.abort();
      AppLikeReadyInstance.setReady();
    }
  }, []);

  const paymentSuccessCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      if (paymentStatus.action === 'likeNFT') {
        setLikeLoading(false);
        dispatch(addNFTDetailsViewLike({ key: route.key }));
      }
    },
    [dispatch, route.key],
  );

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined && ['likeNFT'].includes(paymentStatus.action) && paymentStatus.id === nft.id
      );
    },
    [nft.id],
  );

  usePaymentCallback({
    condition: paymentCondition,
    onIdle: paymentIdleCallback,
    onSuccess: paymentSuccessCallback,
  });

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
      onMomentumScrollBegin={onMomentumScroll}
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

      <AppNFTDetailsRedeemBar nft={nft} navigation={navigation} route={route} />

      <View style={styles.nftDetailsChipsContainer}>
        <AppQuaternaryButton
          loading={likeLoading}
          loadingSize={15}
          loadingStyle={styles.likeButtonLoadingStyle}
          icon={nft.liked ? iconMap.likeActive : iconMap.likeInactive}
          iconSize={hp('3%')}
          iconColor={nft.liked ? theme.colors.primary : theme.colors.text}
          style={{
            height: hp('4%'),
          }}
          onPress={nft.liked ? onLikeDeactivate : onLikeActivate}>
          <AppTextBody4 style={{ color: nft.liked ? theme.colors.primary : theme.colors.text }}>
            {numberKMB(nft.like, 2)}
          </AppTextBody4>
        </AppQuaternaryButton>
        <AppQuaternaryButton
          icon={iconMap.comment}
          iconSize={hp('3%')}
          iconColor={theme.colors.text}
          style={{
            height: hp('4%'),
          }}
          onPress={() => navigation.push('Comment', { type: 'nft', mode: 'id', arg: nft.id })}>
          <AppTextBody4>{numberKMB(nft.comment, 2)}</AppTextBody4>
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
    likeButtonLoadingStyle: {
      marginRight: wp('2.5%'),
      marginLeft: wp('2.5%'),
      height: '100%',
    },
    contentContainerStyle: {
      paddingTop: hp(NFT_DETAILS_TOP_TABBAR_HEIGHT_PERCENTAGE) + collectionHeaderHeight,
      minHeight:
        Dimensions.get('screen').height +
        collectionHeaderHeight -
        hp(HEADER_HEIGHT_PERCENTAGE) -
        insets.top -
        insets.bottom,
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
