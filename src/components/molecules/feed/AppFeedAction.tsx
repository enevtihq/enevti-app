import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading4 from 'enevti-app/components/atoms/text/AppTextHeading4';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import { Theme } from 'enevti-app/theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { FeedItem } from 'enevti-app/types/core/service/feed';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { useDispatch } from 'react-redux';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { getCollectionById } from 'enevti-app/service/enevti/collection';
import { isMintingAvailable } from 'enevti-app/utils/collection';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { payMintCollection } from 'enevti-app/store/middleware/thunk/payment/creator/payMintCollection';
import { useTranslation } from 'react-i18next';

interface AppFeedActionProps {
  feed: FeedItem;
}

export default React.memo(
  function AppFeedAction({ feed }: AppFeedActionProps) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const theme = useTheme() as Theme;
    const styles = React.useMemo(() => makeStyles(insets), [insets]);
    const [like, setLike] = React.useState<1 | 0>(0);
    const [buyLoading, setBuyLoading] = React.useState<boolean>(false);
    const paymentThunkRef = React.useRef<any>();

    const onLikeActivate = () => {
      // setLike(1);
      dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }));
    };

    const onLikeDeactivate = () => {
      setLike(0);
    };

    const onComment = React.useCallback(() => {
      dispatch(showSnackbar({ mode: 'info', text: 'Coming Soon!' }));
    }, [dispatch]);

    const paymentIdleCallback = React.useCallback(() => {
      setBuyLoading(false);
      paymentThunkRef.current?.abort();
    }, []);

    const paymentSuccessCallback = React.useCallback(() => {
      dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
    }, [dispatch, t]);

    usePaymentCallback({
      onIdle: paymentIdleCallback,
      onSuccess: paymentSuccessCallback,
    });

    const onBuy = React.useCallback(async () => {
      setBuyLoading(true);
      if (feed.type !== 'nft') {
        const collectionResponse = await getCollectionById(feed.id);
        if (collectionResponse.status === 200 && isMintingAvailable(collectionResponse.data)) {
          if (collectionResponse.data.mintingType === 'normal') {
            paymentThunkRef.current = dispatch(payMintCollection({ collection: collectionResponse.data, quantity: 1 }));
          } else {
            dispatch(showSnackbar({ mode: 'info', text: t('collection:specialMint') }));
            setBuyLoading(false);
          }
        } else {
          dispatch(showSnackbar({ mode: 'info', text: t('collection:mintingUnavailable') }));
          setBuyLoading(false);
        }
      } else {
        setBuyLoading(false);
      }
    }, [feed.id, feed.type, dispatch, t]);

    return (
      <View style={styles.actionContainer}>
        <AppQuaternaryButton
          icon={like ? iconMap.likeActive : iconMap.likeInactive}
          iconSize={wp('6%', insets)}
          iconColor={like ? theme.colors.primary : theme.colors.text}
          style={styles.button}
          onPress={like ? onLikeDeactivate : onLikeActivate}>
          <AppTextBody4 style={[styles.actionButtonText, { color: like ? theme.colors.primary : theme.colors.text }]}>
            {feed.like + like}
          </AppTextBody4>
        </AppQuaternaryButton>

        <AppQuaternaryButton
          icon={iconMap.comment}
          iconSize={wp('6%', insets)}
          style={styles.button}
          onPress={onComment}>
          <AppTextBody4 style={styles.actionButtonText}>{feed.comment}</AppTextBody4>
        </AppQuaternaryButton>

        <View style={styles.divider} />

        <AppQuaternaryButton
          box
          loading={buyLoading}
          icon={iconMap.buy}
          iconSize={wp('6%', insets)}
          style={styles.button}
          contentStyle={styles.buyButtonContentStyle}
          loadingStyle={styles.buyButtonLoadingStyle}
          loadingSize={15}
          onPress={onBuy}>
          <AppTextHeading4 style={styles.actionButtonText}>
            {parseAmount(feed.price.amount)} <AppTextBody5>${feed.price.currency}</AppTextBody5>
          </AppTextHeading4>
        </AppQuaternaryButton>
      </View>
    );
  },
  () => {
    return true;
  },
);

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    button: {
      height: '100%',
    },
    buyButtonContentStyle: {
      paddingVertical: hp('0.5%', insets),
      paddingHorizontal: wp('1%', insets),
    },
    buyButtonLoadingStyle: {
      marginRight: wp('8%', insets),
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
      paddingVertical: wp('2%', insets),
      paddingHorizontal: wp('3%', insets),
      height: hp('6%', insets),
    },
  });
