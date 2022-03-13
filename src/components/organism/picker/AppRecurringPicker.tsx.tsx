import React from 'react';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import { PickerItem } from '../../../types/screen/PickerItem';
import { useTranslation } from 'react-i18next';
import AppListPicker from '../../molecules/listpicker/AppListPicker';

interface AppRecurringPickerProps {
  value?: string;
  onSelected?: (item: PickerItem) => void;
}

export default function AppRecurringPicker({
  value,
  onSelected,
}: AppRecurringPickerProps) {
  const { t } = useTranslation();

  const recurringItem: PickerItem[] = React.useMemo(
    () => [
      {
        value: 'every-day',
        icon: iconMap.everyDay,
        title: t('createNFT:recurringEveryDay'),
        description: t('createNFT:recurringEveryDayDescription'),
      },
      {
        value: 'every-week',
        icon: iconMap.everyWeek,
        title: t('createNFT:recurringEveryWeek'),
        description: t('createNFT:recurringEveryWeekDescription'),
      },
      {
        value: 'every-month',
        icon: iconMap.everyMonth,
        title: t('createNFT:recurringEveryMonth'),
        description: t('createNFT:recurringEveryMonthDescription'),
      },
      {
        value: 'every-year',
        icon: iconMap.everyYear,
        title: t('createNFT:recurringEveryYear'),
        description: t('createNFT:recurringEveryYearDescription'),
      },
      {
        value: 'once',
        icon: iconMap.once,
        title: t('createNFT:recurringOnce'),
        description: t('createNFT:recurringOnceDescription'),
      },
    ],
    [t],
  );

  return (
    <AppListPicker
      items={recurringItem}
      label={t('createNFT:selectRecurring')}
      subLabel={t('createNFT:selectRecurringDescription')}
      onSelected={onSelected}
      value={value}
    />
  );
}
