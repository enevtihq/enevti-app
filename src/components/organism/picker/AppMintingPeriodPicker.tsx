import React from 'react';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import { PickerItem } from '../../../types/screen/PickerItem';
import { useTranslation } from 'react-i18next';
import AppFormPicker from '../../molecules/listpicker/AppFormPicker';

interface AppMintingPeriodPickerProps {
  label: string;
  value?: string;
  onSelected?: (item: PickerItem) => void;
}

export default function AppMintingPeriodPicker({
  label,
  value,
  onSelected,
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
