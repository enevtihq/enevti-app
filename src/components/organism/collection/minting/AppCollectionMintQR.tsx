import React from 'react';
import { getCollectionById } from 'enevti-app/service/enevti/collection';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { MintNFTByQR } from 'enevti-types/asset/redeemable_nft/mint_nft_type_qr_asset';
import { isErrorResponse } from 'enevti-app/utils/error/handle';
import { getMyPublicKey } from 'enevti-app/service/enevti/persona';
import { createSignature } from 'enevti-app/utils/cryptography';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import { Platform, StyleSheet, View } from 'react-native';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppIconGradient from 'enevti-app/components/molecules/icon/AppIconGradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from 'enevti-app/theme/default';
import { useTheme } from 'react-native-paper';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';
import createQRValue from 'enevti-app/utils/qr/createQRValue';
import AppQuaternaryButton from 'enevti-app/components/atoms/button/AppQuaternaryButton';
import base64 from 'react-native-base64';
import AppQRCode from 'enevti-app/components/atoms/qr/AppQRCode';

interface AppCollectionMintQRProps {
  collectionId: string;
  onDismiss: () => void;
}

export default function AppCollectionMintQR({ collectionId, onDismiss }: AppCollectionMintQRProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  const snapPoints = React.useMemo(() => ['70%'], []);
  const [value, setValue] = React.useState<string>('');

  const onLoad = React.useCallback(async () => {
    const collection = await getCollectionById(collectionId, false);
    if (collection.status === 200 && !isErrorResponse(collection)) {
      const myPublicKey = await getMyPublicKey();
      const bodyObj: MintNFTByQR = {
        id: collection.data.id,
        quantity: 1,
        nonce: collection.data.stat.minted,
        publicKey: myPublicKey,
      };
      const body = base64.encode(JSON.stringify(bodyObj));
      const signature = await createSignature(body);
      const qr = createQRValue('qrmint', JSON.stringify({ body, signature }));
      setValue(qr);
    }
  }, [collectionId]);

  const onRefresh = React.useCallback(() => {
    setValue('');
    onLoad();
  }, [onLoad]);

  React.useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <AppMenuContainer visible={true} snapPoints={snapPoints} onDismiss={onDismiss}>
      {value ? (
        <View style={styles.container}>
          <AppListItem
            leftContent={
              <AppIconGradient
                name={iconMap.utilityQR}
                size={wp('12%')}
                androidRenderingMode={'software'}
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.headerIcon}
              />
            }
            containerStyle={styles.header}>
            <AppTextHeading3 numberOfLines={1} style={styles.headerTitle}>
              {t('collection:showThisQR')}
            </AppTextHeading3>
            <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
              {t('collection:showThisQRDescription')}
            </AppTextBody4>
          </AppListItem>

          <View style={styles.qrContainer}>
            <AppQRCode value={value} size={wp(70)} />
            <View style={{ height: hp(3) }} />
            <AppQuaternaryButton
              icon={iconMap.refresh}
              iconSize={hp('3%')}
              iconColor={theme.colors.placeholder}
              style={{
                height: hp('4%'),
              }}
              onPress={onRefresh}>
              <AppTextBody4 style={{ color: theme.colors.placeholder }}>{t('collection:refresh')}</AppTextBody4>
            </AppQuaternaryButton>
          </View>

          <View style={styles.doneButton}>
            <AppPrimaryButton onPress={onDismiss}>{t('collection:done')}</AppPrimaryButton>
          </View>
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <AppActivityIndicator animating={true} />
        </View>
      )}
    </AppMenuContainer>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    doneButton: {
      paddingHorizontal: wp('5%'),
      marginTop: hp('2%'),
      marginBottom: Platform.OS === 'ios' ? insets.bottom : hp('2%'),
    },
    header: {
      marginBottom: hp(0),
    },
    headerTitle: {
      width: wp('50%'),
    },
    headerIcon: {
      marginRight: wp('3%'),
      alignSelf: 'center',
    },
    qrContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
