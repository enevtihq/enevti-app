import React from 'react';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { PickerItem } from 'enevti-app/types/ui/screen/PickerItem';
import { useTranslation } from 'react-i18next';
import { shallowEqual } from 'react-redux';
import AppListPicker from 'enevti-app/components/molecules/listpicker/AppListPicker';

interface AppMintingTypePickerProps {
  value?: string;
  onSelected?: (item: PickerItem) => void;
  memoKey?: (keyof AppMintingTypePickerProps)[];
}

function Component({
  value,
  onSelected,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppMintingTypePickerProps) {
  const { t } = useTranslation();

  const mintingTypeItem: PickerItem[] = React.useMemo(
    () => [
      {
        value: 'normal',
        icon: iconMap.dollar,
        title: t('createNFT:mintingTypeNormal'),
        description: t('createNFT:mintingTypeNormalDescription'),
      },
      {
        value: 'qr',
        icon: iconMap.utilityQR,
        title: t('createNFT:mintingTypeExclusive'),
        description: t('createNFT:mintingTypeExclusiveDescription'),
      },
    ],
    [t],
  );

  return (
    <AppListPicker
      items={mintingTypeItem}
      label={t('createNFT:mintingType')}
      subLabel={t('createNFT:mintingTypeDescription')}
      onSelected={onSelected}
      value={value}
    />
  );
}

const AppMintingTypePicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppMintingTypePicker;
