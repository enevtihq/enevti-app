import React from 'react';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import { PickerItem } from '../../../types/screen/PickerItem';
import { useTranslation } from 'react-i18next';
import AppFormPicker from '../../molecules/listpicker/AppFormPicker';
import { shallowEqual } from 'react-redux';

interface AppRedeemLimitPickerProps {
  label: string;
  value?: string;
  onSelected?: (item: PickerItem) => void;
  memoKey?: (keyof AppRedeemLimitPickerProps)[];
}

function Component({
  label,
  value,
  onSelected,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppRedeemLimitPickerProps) {
  const { t } = useTranslation();

  const redeemLimitItem: PickerItem[] = React.useMemo(
    () => [
      {
        value: 'no-limit',
        icon: iconMap.unlimited,
        title: t('createNFT:redeemLimitForever'),
        description: t('createNFT:redeemLimitForeverDescription'),
      },
      {
        value: 'fixed',
        icon: iconMap.count,
        title: t('createNFT:redeemLimitFixed'),
        description: t('createNFT:redeemLimitFixedDescription'),
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

const AppRedeemLimitPicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppRedeemLimitPicker;
