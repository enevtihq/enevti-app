import React from 'react';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { PickerItem } from 'enevti-app/types/screen/PickerItem';
import { useTranslation } from 'react-i18next';
import AppListPicker from 'enevti-app/components/molecules/listpicker/AppListPicker';
import { shallowEqual } from 'react-redux';

interface AppRecurringPickerProps {
  value?: string;
  onSelected?: (item: PickerItem) => void;
  memoKey?: (keyof AppRecurringPickerProps)[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Component({ value, onSelected, memoKey }: AppRecurringPickerProps) {
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

const AppRecurringPicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppRecurringPicker;
