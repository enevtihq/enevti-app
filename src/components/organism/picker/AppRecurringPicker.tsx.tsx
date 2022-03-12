import { View } from 'react-native';
import React from 'react';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import AppListPickerItem from '../../molecules/listpicker/AppListPickerItem';
import AppListPickerMenu from '../../molecules/listpicker/AppListPickerMenu';
import { PickerItem } from '../../../types/screen/PickerItem';
import { useTranslation } from 'react-i18next';

interface AppRecurringPickerProps {
  value?: string;
  onSelected?: (item: PickerItem) => void;
}

export default function AppRecurringPicker({
  value,
  onSelected,
}: AppRecurringPickerProps) {
  const { t } = useTranslation();
  const [recurringSelectorVisible, setRecurringSelectorVisible] =
    React.useState<boolean>(false);

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

  const recurringSelector: PickerItem = React.useMemo(
    () => ({
      value: undefined,
      icon: iconMap.add,
      title: 'Select Recurring',
      description: 'Set your NFT redeem frequency!',
    }),
    [],
  );

  const selectedIndex: number | undefined = React.useMemo(() => {
    if (value) {
      for (let i = 0; i < recurringItem.length; i++) {
        if (recurringItem[i].value === value) {
          return i;
        }
      }
      return undefined;
    }
    return undefined;
  }, [value, recurringItem]);

  return (
    <View>
      {value && selectedIndex !== undefined ? (
        <AppListPickerItem
          showDropDown
          onPress={() => setRecurringSelectorVisible(!recurringSelectorVisible)}
          icon={recurringItem[selectedIndex].icon}
          title={recurringItem[selectedIndex].title}
          description={recurringItem[selectedIndex].description}
        />
      ) : (
        <AppListPickerItem
          showDropDown
          onPress={() => setRecurringSelectorVisible(!recurringSelectorVisible)}
          icon={recurringSelector.icon}
          title={recurringSelector.title}
          description={recurringSelector.description}
        />
      )}

      <AppListPickerMenu
        items={recurringItem}
        visible={recurringSelectorVisible}
        onDismiss={() => setRecurringSelectorVisible(false)}
        onSelected={item => {
          onSelected && onSelected(item);
        }}
      />
    </View>
  );
}
