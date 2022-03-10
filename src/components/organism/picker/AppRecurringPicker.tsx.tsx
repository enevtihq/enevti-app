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
        icon: iconMap.utilityContent,
        title: 'Every Day',
        description: 'Description of Every Day',
      },
      {
        value: 'every-week',
        icon: iconMap.utilityVideoCall,
        title: 'Every Week',
        description: 'Description of Every Week',
      },
      {
        value: 'every-month',
        icon: iconMap.utilityChat,
        title: 'Every month',
        description: 'Description of Every Month',
      },
      {
        value: 'every-year',
        icon: iconMap.utilityGift,
        title: 'Every Year',
        description: 'Description of Physical Gift',
      },
      {
        value: 'once',
        icon: iconMap.utilityQR,
        title: 'Once',
        description: 'Description of Once',
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
