import React from 'react';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import { PickerItem } from '../../../types/screen/PickerItem';
import { useTranslation } from 'react-i18next';
import AppFormPicker from '../../molecules/listpicker/AppFormPicker';

interface AppRedeemLimitPickerProps {
  label: string;
  value?: string;
  onSelected?: (item: PickerItem) => void;
}

export default function AppRedeemLimitPicker({
  label,
  value,
  onSelected,
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
