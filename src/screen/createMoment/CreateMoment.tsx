import { View, Image, TextInput, StyleSheet, Platform, Keyboard } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCreateMomentQueue,
  selectCreateMomentQueue,
  selectCreateMomentQueueText,
  setCreateMomentQueueText,
} from 'enevti-app/store/slices/queue/moment/create';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader, { HEADER_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/view/AppHeader';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { Divider, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppMentionInput from 'enevti-app/components/molecules/form/AppMentionInput';
import { useTranslation } from 'react-i18next';
import AppNFTRenderer from 'enevti-app/components/molecules/nft/AppNFTRenderer';
import AppTextBody5 from 'enevti-app/components/atoms/text/AppTextBody5';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import utilityToLabel from 'enevti-app/utils/format/utilityToLabel';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { payMintMoment } from 'enevti-app/store/middleware/thunk/payment/creator/payMintMoment';
import { hideModalLoader } from 'enevti-app/store/slices/ui/global/modalLoader';
import { showSnackbar } from 'enevti-app/store/slices/ui/global/snackbar';
import { cleanTMPImage } from 'enevti-app/service/enevti/nft';
import AppConfirmationModal from 'enevti-app/components/organism/menu/AppConfirmationModal';

type Props = StackScreenProps<RootStackParamList, 'CreateMoment'>;

export default function CreateMoment({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  const inputRef = React.useRef<TextInput>(null);
  const canGoBack = React.useRef<boolean>(false);
  const paymentThunkRef = React.useRef<any>();
  const createMomentQueue = useSelector(selectCreateMomentQueue);
  const createMomentQueueText = useSelector(selectCreateMomentQueueText);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [closeMenuVisible, setCloseMenuVisible] = React.useState<boolean>(false);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (canGoBack.current) {
          setCloseMenuVisible(false);
          navigation.dispatch(e.data.action);
        } else {
          e.preventDefault();
          Keyboard.dismiss();
          setCloseMenuVisible(visible => !visible);
        }
      }),
    [navigation],
  );

  const discardFormState = React.useCallback(() => {
    dispatch(clearCreateMomentQueue());
    cleanTMPImage();
    canGoBack.current = true;
    setCloseMenuVisible(false);
    navigation.goBack();
  }, [dispatch, navigation]);

  const saveFormState = React.useCallback(() => {
    canGoBack.current = true;
    setCloseMenuVisible(false);
    navigation.goBack();
  }, [navigation]);

  const closeMenuOnDismiss = React.useCallback(() => setCloseMenuVisible(false), []);

  const handleFormSubmit = async () => {
    setLoading(true);
    paymentThunkRef.current = dispatch(payMintMoment({ key: route.key, data: createMomentQueue }));
  };

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined &&
        ['mintMoment'].includes(paymentStatus.action) &&
        paymentStatus.key === route.key
      );
    },
    [route.key],
  );

  const paymentIdleCallback = React.useCallback(() => {
    setLoading(false);
    paymentThunkRef.current?.abort();
  }, []);

  const paymentSuccessCallback = React.useCallback(() => {
    dispatch(hideModalLoader());
    dispatch(showSnackbar({ mode: 'info', text: t('payment:success') }));
    discardFormState();
  }, [dispatch, discardFormState, t]);

  const paymentErrorCallback = React.useCallback(() => dispatch(hideModalLoader()), [dispatch]);

  usePaymentCallback({
    condition: paymentCondition,
    onIdle: paymentIdleCallback,
    onSuccess: paymentSuccessCallback,
    onError: paymentErrorCallback,
  });

  return (
    <AppView
      dismissKeyboard
      withModal
      withPayment
      withLoader
      edges={['bottom', 'left', 'right']}
      headerOffset={insets.top + hp(HEADER_HEIGHT_PERCENTAGE)}
      header={
        <AppHeader back backIcon={iconMap.close} backIconSize={23} navigation={navigation} title={'New Moment'} />
      }>
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnailBox}>
          <Image source={{ uri: createMomentQueue.cover }} style={styles.thumbnail} resizeMode={'cover'} />
        </View>
      </View>
      <AppMentionInput
        bottom
        inputRef={inputRef}
        value={createMomentQueueText}
        onChange={e => {
          dispatch(setCreateMomentQueueText(e));
        }}
        placeholder={t('createMoment:captionPlaceholder')}
        style={styles.captionInput}
        suggestionStyle={styles.suggestionInput}
      />
      <Divider style={styles.divider} />
      {createMomentQueue.nft ? (
        <View style={styles.nftContainer}>
          <AppNFTRenderer imageSize={'s'} nft={createMomentQueue.nft} width={wp(10)} style={styles.nftRenderer} />
          <View style={styles.attachedTo}>
            <AppTextBody5 style={{ color: theme.colors.placeholder }}>{t('createMoment:attachedTo')}</AppTextBody5>
            <AppTextHeading3>{`${createMomentQueue.nft.symbol}#${createMomentQueue.nft.serial}`}</AppTextHeading3>
          </View>
          <View style={styles.utilityLabel}>
            <AppTextBody5>{utilityToLabel(createMomentQueue.nft.utility)}</AppTextBody5>
          </View>
        </View>
      ) : null}
      <View style={styles.actionContainer}>
        <View style={{ height: hp('2%') }} />
        <AppPrimaryButton
          onPress={handleFormSubmit}
          loading={loading}
          disabled={!createMomentQueueText}
          style={styles.actionButton}>
          {!createMomentQueueText ? t('createMoment:captionRequired') : t('createMoment:mintMoment')}
        </AppPrimaryButton>
        <View style={{ height: Platform.OS === 'ios' ? insets.bottom : hp('2%') }} />
      </View>
      <AppConfirmationModal
        iconName={'question'}
        visible={closeMenuVisible}
        onDismiss={closeMenuOnDismiss}
        title={t('createMoment:saveSession')}
        description={t('createMoment:saveSessionDescription')}
        cancelText={t('createMoment:discard')}
        cancelOnPress={discardFormState}
        okText={t('createMoment:save')}
        okOnPress={saveFormState}
      />
    </AppView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    thumbnailContainer: {
      height: hp(38),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp(2),
    },
    thumbnailBox: {
      height: hp(36),
      aspectRatio: 0.5625,
      borderRadius: theme.roundness,
      overflow: 'hidden',
    },
    thumbnail: {
      height: '100%',
      width: '100%',
    },
    divider: {
      marginHorizontal: wp(3),
      marginBottom: hp(3),
    },
    nftContainer: {
      flexDirection: 'row',
      marginHorizontal: wp(3),
      zIndex: -999,
    },
    attachedTo: {
      flex: 1,
      justifyContent: 'center',
    },
    utilityLabel: {
      justifyContent: 'center',
    },
    captionInput: {
      minHeight: hp(6),
      maxHeight: hp(14),
      marginHorizontal: wp(3),
    },
    suggestionInput: {
      position: 'absolute',
      width: '100%',
      marginTop: hp(8),
      zIndex: 999,
    },
    nftRenderer: {
      width: wp(10),
      marginRight: wp('2%'),
      alignSelf: 'center',
      borderRadius: wp(10),
      overflow: 'hidden',
    },
    actionContainer: {
      position: 'absolute',
      backgroundColor: theme.colors.background,
      width: '100%',
      bottom: 0,
    },
    actionButton: {
      marginHorizontal: wp(5),
    },
  });
