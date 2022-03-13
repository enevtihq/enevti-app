import React from 'react';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import { PickerItem } from '../../../types/screen/PickerItem';
import { useTranslation } from 'react-i18next';
import AppListPicker from '../../molecules/listpicker/AppListPicker';

interface AppUtilityPickerProps {
  value?: string;
  onSelected?: (item: PickerItem) => void;
}

export default function AppUtilityPicker({
  value,
  onSelected,
}: AppUtilityPickerProps) {
  const { t } = useTranslation();

  const utilityItem: PickerItem[] = React.useMemo(
    () => [
      {
        value: 'content',
        icon: iconMap.utilityContent,
        title: t('createNFT:utilityContent'),
        description: t('createNFT:utilityContentDescription'),
        disabled: false,
      },
      {
        value: 'videocall',
        icon: iconMap.utilityVideoCall,
        title: t('createNFT:utilityVideoCall'),
        description: t('createNFT:utilityVideoCallDescription'),
        disabled: false,
      },
      {
        value: 'chat',
        icon: iconMap.utilityChat,
        title: t('createNFT:utilityChat'),
        description: t('createNFT:utilityChatDescription'),
        disabled: true,
      },
      {
        value: 'gift',
        icon: iconMap.utilityGift,
        title: t('createNFT:utilityGift'),
        description: t('createNFT:utilityGiftDescription'),
        disabled: true,
      },
      {
        value: 'qr',
        icon: iconMap.utilityQR,
        title: t('createNFT:utilityQR'),
        description: t('createNFT:utilityQRDescription'),
        disabled: true,
      },
      {
        value: 'stream',
        icon: iconMap.utilityStream,
        title: t('createNFT:utilityStream'),
        description: t('createNFT:utilityStreamDescription'),
        disabled: true,
      },
    ],
    [t],
  );

  return (
    <AppListPicker
      items={utilityItem}
      label={t('createNFT:selectUtility')}
      subLabel={t('createNFT:selectUtilityDescription')}
      onSelected={onSelected}
      value={value}
    />
  );
}
