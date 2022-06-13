import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import { menuItemHeigtPercentage } from 'enevti-app/utils/layout/menuItemHeigtPercentage';
import AppMenuItem from 'enevti-app/components/atoms/menu/AppMenuItem';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { useTranslation } from 'react-i18next';
import AppCollectionMintQR from 'enevti-app/components/organism/collection/minting/AppCollectionMintQR';
import { View } from 'react-native';

interface AppCollectionMintOptionsProps {
  collectionId: string;
  collectionType: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function AppCollectionMintOptions({
  collectionId,
  collectionType,
  visible,
  onDismiss,
}: AppCollectionMintOptionsProps) {
  const { t } = useTranslation();
  const [showMintQR, setShowMintQR] = React.useState<boolean>(false);

  const onMintQRDismiss = React.useCallback(() => setShowMintQR(false), []);

  return (
    <View>
      <AppMenuContainer
        tapEverywhereToDismiss
        visible={visible}
        onDismiss={onDismiss}
        snapPoints={[`${menuItemHeigtPercentage(2)}%`]}>
        <AppMenuItem
          icon={iconMap.utilityQR}
          onPress={() => {
            setShowMintQR(old => !old);
            onDismiss();
          }}
          title={t('collection:showMintQR')}
        />
        <AppMenuItem
          icon={iconMap.camera}
          onPress={() => {
            onDismiss();
          }}
          title={
            collectionType === 'onekind'
              ? t('collection:mintOneKindQRName')
              : collectionType === 'packed'
              ? t('collection:mintPackedQRName')
              : t('error:unknown')
          }
        />
      </AppMenuContainer>
      {showMintQR ? <AppCollectionMintQR collectionId={collectionId} onDismiss={onMintQRDismiss} /> : null}
    </View>
  );
}
