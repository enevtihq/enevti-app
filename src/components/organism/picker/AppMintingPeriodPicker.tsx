import React from 'react';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { PickerItem } from 'enevti-app/types/ui/screen/PickerItem';
import { useTranslation } from 'react-i18next';
import AppFormPicker from 'enevti-app/components/molecules/listpicker/AppFormPicker';
import { shallowEqual } from 'react-redux';

interface AppMintingPeriodPickerProps {
  label: string;
  value?: string;
  onSelected?: (item: PickerItem) => void;
  memoKey?: (keyof AppMintingPeriodPickerProps)[];
}

function Component({
  label,
  value,
  onSelected,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppMintingPeriodPickerProps) {
  const { t } = useTranslation();

  const redeemLimitItem: PickerItem[] = React.useMemo(
    () => [
      {
        value: 'no-limit',
        icon: iconMap.unlimited,
        title: t('createNFT:mintingPeriodLimitForever'),
        description: t('createNFT:mintingPeriodLimitForeverDescription'),
      },
      {
        value: 'fixed',
        icon: iconMap.count,
        title: t('createNFT:mintingPeriodLimitFixed'),
        description: t('createNFT:mintingPeriodLimitFixedDescription'),
      },
    ],
    [t],
  );

  return (
    <AppFormPicker
      items={redeemLimitItem}
      label={label}
      onSelected={onSelected}
      value={value}
    />
  );
}

const AppMintingPeriodPicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppMintingPeriodPicker;
