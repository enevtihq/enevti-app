import { View } from 'react-native';
import React from 'react';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import AppListPickerItem from '../../molecules/listpicker/AppListPickerItem';
import AppListPickerMenu from '../../molecules/listpicker/AppListPickerMenu';
import { PickerItem } from '../../../types/screen/PickerItem';

interface AppRecurringPickerProps {
  value?: string;
  onSelected?: (item: PickerItem) => void;
}

export default function AppRecurringPicker({
  value,
  onSelected,
}: AppRecurringPickerProps) {
  const [recurringSelectorVisible, setRecurringSelectorVisible] =
    React.useState<boolean>(false);

  const recurringItem: PickerItem[] = React.useMemo(
    () => [
      {
        value: 'every-day',
        icon: iconMap.everyDay,
        title: 'Every Day',
        description: 'Fans can redeem this NFT every day',
      },
      {
        value: 'every-week',
        icon: iconMap.everyWeek,
        title: 'Every Week',
        description: 'Fans can redeem this NFT once a week',
      },
      {
        value: 'every-month',
        icon: iconMap.everyMonth,
        title: 'Every Month',
        description: 'Fans can redeem this NFT once a month',
      },
      {
        value: 'every-year',
        icon: iconMap.everyYear,
        title: 'Every Year',
        description: 'Fans can redeem this NFT once a year',
      },
      {
        value: 'once',
        icon: iconMap.once,
        title: 'Once',
        description: 'Fans can redeem this NFT once a lifetime',
      },
    ],
    [],
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
