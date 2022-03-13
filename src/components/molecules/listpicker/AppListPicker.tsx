import { View } from 'react-native';
import React from 'react';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import AppListPickerItem from '../../molecules/listpicker/AppListPickerItem';
import AppListPickerMenu from '../../molecules/listpicker/AppListPickerMenu';
import { PickerItem } from '../../../types/screen/PickerItem';

interface AppListPickerProps {
  items: PickerItem[];
  label: string;
  subLabel: string;
  value?: string;
  onSelected?: (item: PickerItem) => void;
}

export default function AppListPicker({
  items,
  label,
  subLabel,
  value,
  onSelected,
}: AppListPickerProps) {
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  const selectedIndex: number | undefined = React.useMemo(() => {
    if (value) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].value === value) {
          return i;
        }
      }
      return undefined;
    }
    return undefined;
  }, [value, items]);

  return (
    <View>
      {value && selectedIndex !== undefined ? (
        <AppListPickerItem
          showDropDown
          onPress={() => setMenuVisible(!menuVisible)}
          icon={items[selectedIndex].icon}
          title={items[selectedIndex].title}
          description={items[selectedIndex].description}
        />
      ) : (
        <AppListPickerItem
          showDropDown
          onPress={() => setMenuVisible(!menuVisible)}
          icon={iconMap.add}
          title={label}
          description={subLabel}
        />
      )}

      <AppListPickerMenu
        items={items}
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        onSelected={item => {
          onSelected && onSelected(item);
        }}
      />
    </View>
  );
}
