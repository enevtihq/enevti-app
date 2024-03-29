import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { Theme } from 'enevti-app/theme/default';
import { useTheme } from 'react-native-paper';
import { FeedItem } from 'enevti-types/service/feed';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { getCollectionById } from 'enevti-app/service/enevti/collection';
import { isMintingAvailable } from 'enevti-app/utils/collection';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { payMintCollection } from 'enevti-app/store/middleware/thunk/payment/creator/payMintCollection';
import { useTranslation } from 'react-i18next';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import { directPayLikeCollection } from 'enevti-app/store/middleware/thunk/payment/direct/directPayLikeCollection';
import { addFeedViewLike, isFeedBuyDisabled, setFeedViewBuyDisabled } from 'enevti-app/store/slices/ui/view/feed';
import { selectOnceLike, showOnceLike } from 'enevti-app/store/slices/entities/once/like';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { FEED_CACHE_MAX_LENGTH } from 'enevti-app/service/enevti/feed';
import { addFeedItemsCacheLike } from 'enevti-app/store/slices/entities/cache/feed';
import AppLikeReadyInstance from 'enevti-app/utils/app/likeReady';
import useDebouncedNavigation from 'enevti-app/utils/hook/useDebouncedNavigation';

interface AppFeedActionProps {
  feed: FeedItem;
  index: number;
  navigation: StackNavigationProp<RootStackParamList>;
}

export default function AppFeedAction({ feed, index, navigation }: AppFeedActionProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);
  const [buyLoading, setBuyLoading] = React.useState<boolean>(false);
  const [likeLoading, setLikeLoading] = React.useState<boolean>(false);
  const paymentThunkRef = React.useRef<any>();
  const likeThunkRef = React.useRef<any>();
  const onceLike = useSelector(selectOnceLike);
  const buyDisabled = useSelector(isFeedBuyDisabled);
  const dnavigation = useDebouncedNavigation(navigation);

  const onLikeActivate = React.useCallback(async () => {
    if (onceLike) {
      setLikeLoading(true);
      likeThunkRef.current = dispatch(directPayLikeCollection({ id: feed.id, key: 'home', name: feed.name }));
    } else {
      dispatch(showOnceLike());
    }
  }, [dispatch, feed, onceLike]);

  const onLikeDeactivate = React.useCallback(() => {
    dispatch(showSnackbar({ mode: 'info', text: t('home:cannotLike') }));
  }, [dispatch, t]);

  const onComment = React.useCallback(() => {
    dnavigation('Comment', { type: 'collection', mode: 'id', arg: feed.id });
  }, [dnavigation, feed.id]);

  const paymentIdleCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      if (paymentStatus.action === 'mintCollection') {
        setBuyLoading(false);
        dispatch(setFeedViewBuyDisabled(false));
        paymentThunkRef.current?.abort();
      } else if (paymentStatus.action === 'likeCollection') {
        setLikeLoading(false);
        likeThunkRef.current?.abort();
        AppLikeReadyInstance.setReady();
      }
    },
    [dispatch],
  );

  const paymentSuccessCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      if (paymentStatus.action === 'mintCollection') {
        dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
      } else if (paymentStatus.action === 'likeCollection') {
        dispatch(addFeedViewLike({ index }));
        if (index <= FEED_CACHE_MAX_LENGTH) {
          dispatch(addFeedItemsCacheLike({ index }));
        }
      }
    },
    [dispatch, index, t],
  );

  const paymentErrorCallback = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      if (paymentStatus.action === 'likeCollection' && paymentStatus.message === '"Error: Address already exist"') {
        dispatch(addFeedViewLike({ index }));
        if (index <= FEED_CACHE_MAX_LENGTH) {
          dispatch(addFeedItemsCacheLike({ index }));
        }
      }
    },
    [dispatch, index],
  );

  const paymentCleanedCallback = React.useCallback((paymentStatus: PaymentStatus) => {
    if (paymentStatus.action === 'mintCollection') {
      setBuyLoading(false);
    }
  }, []);

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined &&
        ['mintCollection', 'likeCollection'].includes(paymentStatus.action) &&
        paymentStatus.id === feed.id &&
        paymentStatus.key === 'home'
      );
    },
    [feed.id],
  );

  usePaymentCallback({
    condition: paymentCondition,
    onIdle: paymentIdleCallback,
    onSuccess: paymentSuccessCallback,
    onError: paymentErrorCallback,
    onCleaned: paymentCleanedCallback,
  });

  const onBuy = React.useCallback(async () => {
    setBuyLoading(true);
    dispatch(setFeedViewBuyDisabled(true));
    if (feed.type !== 'nft') {
      const collectionResponse = await getCollectionById(feed.id, false);
      if (collectionResponse.status === 200) {
        if (isMintingAvailable(collectionResponse.data)) {
          if (['normal', ''].includes(collectionResponse.data.mintingType)) {
            paymentThunkRef.current = dispatch(
              payMintCollection({ collection: collectionResponse.data, key: 'home', quantity: 1 }),
            );
          } else {
            dispatch(showSnackbar({ mode: 'info', text: t('collection:specialMint') }));
            setBuyLoading(false);
          }
        } else {
          dispatch(showSnackbar({ mode: 'info', text: t('collection:mintingUnavailable') }));
          setBuyLoading(false);
        }
      }
    }
  }, [feed.id, feed.type, dispatch, t]);

  return (
    <View style={styles.actionContainer}>
      <AppQuaternaryButton
        loading={likeLoading}
        loadingSize={15}
        loadingStyle={styles.likeButtonLoadingStyle}
        icon={feed.liked ? iconMap.likeActive : iconMap.likeInactive}
        iconSize={wp('6%')}
        iconColor={feed.liked ? theme.colors.primary : theme.colors.text}
        style={styles.button}
        onPress={feed.liked ? onLikeDeactivate : onLikeActivate}>
        <AppTextBody4
          style={[styles.actionButtonText, { color: feed.liked ? theme.colors.primary : theme.colors.text }]}>
          {feed.like}
        </AppTextBody4>
      </AppQuaternaryButton>

      <AppQuaternaryButton icon={iconMap.comment} iconSize={wp('6%')} style={styles.button} onPress={onComment}>
        <AppTextBody4 style={styles.actionButtonText}>{feed.comment}</AppTextBody4>
      </AppQuaternaryButton>

      <View style={styles.divider} />

      <AppQuaternaryButton
        box
        disabled={buyDisabled}
        loading={buyLoading}
        icon={iconMap.buy}
        iconSize={wp('6%')}
        style={styles.buyButton}
        contentStyle={styles.buyButtonContentStyle}
        loadingStyle={styles.buyButtonLoadingStyle}
        loadingSize={15}
        onPress={onBuy}>
        <AppTextHeading4 style={styles.actionButtonText}>
          {feed.price.amount !== '0' ? parseAmount(feed.price.amount) : t('home:free')}{' '}
          {feed.price.amount !== '0' ? <AppTextBody5>${feed.price.currency}</AppTextBody5> : null}
        </AppTextHeading4>
      </AppQuaternaryButton>
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    button: {
      height: '100%',
    },
    buyButton: {
      height: '100%',
    },
    buyButtonContentStyle: {
      paddingVertical: hp('0.5%'),
      paddingHorizontal: wp('1%'),
    },
    buyButtonLoadingStyle: {
      marginRight: wp('8%'),
      height: '100%',
    },
    likeButtonLoadingStyle: {
      marginRight: wp('2.5%'),
      marginLeft: wp('2.5%'),
      height: '100%',
    },
    actionButtonText: {
      textAlign: 'center',
    },
    divider: {
      flex: 1,
    },
    actionContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: wp('2%'),
      paddingHorizontal: wp('3%'),
      height: hp('6%'),
    },
  });
