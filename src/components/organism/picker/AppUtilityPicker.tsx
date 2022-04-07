import React from 'react';
import { PickerItem } from 'enevti-app/types/screen/PickerItem';
import { useTranslation } from 'react-i18next';
import AppListPicker from 'enevti-app/components/molecules/listpicker/AppListPicker';
import { shallowEqual } from 'react-redux';
import utilityToIcon from 'enevti-app/utils/icon/utilityToIcon';

interface AppUtilityPickerProps {
  value?: string;
  onSelected?: (item: PickerItem) => void;
  memoKey?: (keyof AppUtilityPickerProps)[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Component({ value, onSelected, memoKey }: AppUtilityPickerProps) {
  const { t } = useTranslation();

  const utilityItem: PickerItem[] = React.useMemo(
    () => [
      {
        value: 'content',
        icon: utilityToIcon('content'),
        title: t('createNFT:utilityContent'),
        description: t('createNFT:utilityContentDescription'),
        disabled: false,
      },
      {
        value: 'videocall',
        icon: utilityToIcon('videocall'),
        title: t('createNFT:utilityVideoCall'),
        description: t('createNFT:utilityVideoCallDescription'),
        disabled: false,
      },
      {
        value: 'chat',
        icon: utilityToIcon('chat'),
        title: t('createNFT:utilityChat'),
        description: t('createNFT:utilityChatDescription'),
        disabled: true,
      },
      {
        value: 'gift',
        icon: utilityToIcon('gift'),
        title: t('createNFT:utilityGift'),
        description: t('createNFT:utilityGiftDescription'),
        disabled: true,
      },
      {
        value: 'qr',
        icon: utilityToIcon('qr'),
        title: t('createNFT:utilityQR'),
        description: t('createNFT:utilityQRDescription'),
        disabled: true,
      },
      {
        value: 'stream',
        icon: utilityToIcon('stream'),
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

const AppUtilityPicker = React.memo(Component, (prevProps, nextProps) => {
  if (prevProps.memoKey) {
    let ret = true;
    prevProps.memoKey.forEach(key => {
      if (prevProps[key] !== nextProps[key]) {
        ret = false;
      }
    });
    return ret;
  } else {
    return shallowEqual(prevProps, nextProps);
  }
});
export default AppUtilityPicker;
