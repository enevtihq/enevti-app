import React from 'react';
import { getCollectionById } from 'enevti-app/service/enevti/collection';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { MintNFTByQR } from 'enevti-app/types/core/asset/redeemable_nft/mint_nft_type_qr_asset';
import { isErrorResponse } from 'enevti-app/utils/error/handle';
import { getMyPublicKey } from 'enevti-app/service/enevti/persona';
import { createSignature } from 'enevti-app/utils/cryptography';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';
import QRCode from 'react-native-qrcode-svg';
import { Platform, StyleSheet, View } from 'react-native';
import { stringToBuffer } from 'enevti-app/utils/primitive/string';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppIconGradient from 'enevti-app/components/molecules/AppIconGradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from 'enevti-app/theme/default';
import { useTheme } from 'react-native-paper';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import AppPrimaryButton from 'enevti-app/components/atoms/button/AppPrimaryButton';

interface AppCollectionMintQRProps {
  collectionId: string;
  onDismiss: () => void;
}

export default function AppCollectionMintQR({ collectionId, onDismiss }: AppCollectionMintQRProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const snapPoints = React.useMemo(() => ['70%'], []);
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    async function run() {
      const collection = await getCollectionById(collectionId);
      if (collection.status === 200 && !isErrorResponse(collection)) {
        const myPublicKey = await getMyPublicKey();
        const payloadObj: MintNFTByQR = {
          id: collection.data.id,
          quantity: 1,
          nonce: collection.data.minted.length,
          publicKey: myPublicKey,
        };
        const payload = stringToBuffer(JSON.stringify(payloadObj)).toString('hex');
        const signature = await createSignature(payload);
        const qr = JSON.stringify({ payload, signature });
        setValue(qr);
      }
    }
    run();
  }, [collectionId]);

  return (
    <AppMenuContainer visible={true} snapPoints={snapPoints} onDismiss={onDismiss}>
      {value ? (
        <View style={styles.container}>
          <AppListItem
            leftContent={
              <AppIconGradient
                name={iconMap.utilityQR}
                size={wp('12%', insets)}
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
            <QRCode value={value} size={wp(75)} />
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

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    doneButton: {
      paddingHorizontal: wp('5%', insets),
      marginTop: hp('2%', insets),
      marginBottom: Platform.OS === 'ios' ? insets.bottom : hp('2%', insets),
    },
    header: {
      marginBottom: hp(0, insets),
    },
    headerTitle: {
      width: wp('50%', insets),
    },
    headerIcon: {
      marginRight: wp('3%', insets),
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
