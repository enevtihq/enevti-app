import { View, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { DimensionFunction } from 'enevti-app/utils/imageRatio';
import { Theme } from 'enevti-app/theme/default';
import useDimension from 'enevti-app/utils/hook/useDimension';
import { useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import { iconMap, UNDEFINED_ICON } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading5 from 'enevti-app/components/atoms/text/AppTextHeading5';
import { useTranslation } from 'react-i18next';
import { parseAmount } from 'enevti-app/utils/format/amount';
import { useDispatch, useSelector } from 'react-redux';
import { payMintCollection } from 'enevti-app/store/middleware/thunk/payment/creator/payMintCollection';
import DropShadow from 'react-native-drop-shadow';
import usePaymentCallback from 'enevti-app/utils/hook/usePaymentCallback';
import { Collection } from 'enevti-app/types/core/chain/collection';
import { selectMyPersonaCache } from 'enevti-app/store/slices/entities/cache/myPersona';
import AppCollectionMintOptions from './minting/AppCollectionMintOptions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { payMintCollectionByQR } from 'enevti-app/store/middleware/thunk/payment/creator/payMintCollectionByQR';
import parseQRValue from 'enevti-app/utils/qr/parseQRValue';
import { openQRScanner } from 'enevti-app/utils/qr/openQRScanner';
import { handleError } from 'enevti-app/utils/error/handle';
import { RouteProp } from '@react-navigation/native';
import { PaymentStatus } from 'enevti-app/types/ui/store/Payment';

export const MINT_BUTTON_HEIGHT = 11.5;

interface AppCollectionMintButtonProps {
  collection: Collection;
  mintingAvailable: boolean;
  navigation: StackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Collection'>;
}

export default function AppCollectionMintButton({
  collection,
  mintingAvailable,
  navigation,
  route,
}: AppCollectionMintButtonProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { hp, wp } = useDimension();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(hp, wp, theme), [hp, wp, theme]);

  const myPersona = useSelector(selectMyPersonaCache);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [mintingOptionVisible, setMintingOptionVisible] = React.useState<boolean>(false);
  const paymentThunkRef = React.useRef<any>();

  const paymentCondition = React.useCallback(
    (paymentStatus: PaymentStatus) => {
      return (
        paymentStatus.action !== undefined &&
        ['mintCollection', 'mintCollectionByQR'].includes(paymentStatus.action) &&
        paymentStatus.key === route.key
      );
    },
    [route.key],
  );

  const paymentIdleCallback = React.useCallback(() => {
    setLoading(false);
    paymentThunkRef.current?.abort();
  }, []);

  usePaymentCallback({
    condition: paymentCondition,
    onIdle: paymentIdleCallback,
  });

  const onQRSuccess = React.useCallback(
    (data: string) => {
      try {
        const qrValue = parseQRValue(data);
        if (qrValue && qrValue.action === 'qrmint') {
          paymentThunkRef.current = dispatch(
            payMintCollectionByQR({ collection, key: route.key, payload: qrValue.payload }),
          );
          return;
        }
        throw Error(t('error:unknownQRFormat'));
      } catch (err: any) {
        handleError(err);
        setLoading(false);
      }
    },
    [collection, dispatch, t, route.key],
  );

  const onQRFailed = React.useCallback(() => setLoading(false), []);

  const onScanStart = React.useCallback(
    () => openQRScanner({ navigation, onSuccess: onQRSuccess, onFailed: onQRFailed }),
    [navigation, onQRSuccess, onQRFailed],
  );

  const onMintPress = React.useCallback(() => {
    if (collection.mintingType === 'qr') {
      if (collection.creator.address === myPersona.address) {
        setMintingOptionVisible(old => !old);
      } else {
        setLoading(true);
        onScanStart();
      }
    } else {
      setLoading(true);
      paymentThunkRef.current = dispatch(payMintCollection({ collection, key: route.key, quantity: 1 }));
    }
  }, [dispatch, collection, myPersona.address, onScanStart, route.key]);

  const onMintOptionDismiss = React.useCallback(() => {
    setMintingOptionVisible(false);
  }, []);

  return mintingAvailable ? (
    <View style={styles.actionContainer}>
      {collection.mintingType === 'qr' && collection.creator.address === myPersona.address ? (
        <AppCollectionMintOptions
          collectionId={collection.id}
          collectionType={collection.collectionType}
          visible={mintingOptionVisible}
          onDismiss={onMintOptionDismiss}
          onScanStart={onScanStart}
        />
      ) : null}
      <View style={{ height: hp('2%') }} />
      <DropShadow style={styles.actionButton}>
        <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.actionButtonGradient}>
          <AppQuaternaryButton
            box
            loading={loading}
            icon={
              collection.mintingType === 'qr'
                ? collection.creator.address === myPersona.address
                  ? iconMap.dropDown
                  : iconMap.camera
                : collection.collectionType === 'onekind'
                ? iconMap.buy
                : collection.collectionType === 'packed'
                ? iconMap.random
                : UNDEFINED_ICON
            }
            iconColor={'white'}
            iconSize={20}
            onPress={onMintPress}
            style={styles.actionButtonGradient}
            contentContainerStyle={{ paddingHorizontal: wp('5%') }}
            contentStyle={styles.actionButtonContent}>
            <View style={styles.actionButtonLeft}>
              <AppTextHeading3 numberOfLines={1} style={styles.whiteText}>
                {collection.mintingType === 'qr' && collection.creator.address === myPersona.address
                  ? t('collection:openMintOption')
                  : collection.collectionType === 'onekind'
                  ? collection.mintingType === 'qr'
                    ? t('collection:mintOneKindQRName')
                    : t('payment:payMintOneKindName')
                  : collection.collectionType === 'packed'
                  ? collection.mintingType === 'qr'
                    ? t('collection:mintPackedQRName')
                    : t('payment:payMintPackedName')
                  : t('error:unknown')}
              </AppTextHeading3>
              <AppTextBody4 style={styles.whiteText} numberOfLines={1}>
                {collection.collectionType === 'onekind'
                  ? t('payment:payMintOneKindDescription')
                  : collection.collectionType === 'packed'
                  ? t('payment:payMintPackedDescription', {
                      packSize: collection.packSize,
                    })
                  : t('error:unknown')}
              </AppTextBody4>
            </View>
            <View style={styles.actionButtonRight}>
              <View style={styles.actionButtonRightContent}>
                <AppTextHeading3 style={styles.whiteText}>
                  {collection.minting.price.amount !== '0'
                    ? parseAmount(collection.minting.price.amount, true, 2)
                    : t('collection:free')}{' '}
                </AppTextHeading3>
                {collection.minting.price.amount !== '0' ? (
                  <AppTextHeading5 style={styles.whiteText}>${collection.minting.price.currency}</AppTextHeading5>
                ) : null}
              </View>
            </View>
          </AppQuaternaryButton>
        </LinearGradient>
      </DropShadow>
    </View>
  ) : null;
}

const makeStyles = (hp: DimensionFunction, wp: DimensionFunction, theme: Theme) =>
  StyleSheet.create({
    actionContainer: {
      position: 'absolute',
      zIndex: 999,
      width: '100%',
      height: hp(MINT_BUTTON_HEIGHT),
      bottom: hp(Platform.OS === 'ios' ? 0 : 2),
    },
    actionButton: {
      marginBottom: hp('2%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
      width: wp('70%'),
      alignSelf: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: theme.dark ? 1 : 0.3,
      shadowRadius: theme.dark ? 10 : 7,
    },
    actionButtonGradient: {
      borderRadius: theme.roundness * 2,
    },
    actionButtonContent: {
      flexDirection: 'row',
      paddingLeft: wp('3%'),
    },
    actionButtonLeft: {
      flex: 1,
    },
    actionButtonRight: {
      justifyContent: 'center',
    },
    actionButtonRightContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    whiteText: {
      color: 'white',
    },
  });
