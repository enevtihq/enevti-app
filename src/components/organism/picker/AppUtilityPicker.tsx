import { View } from 'react-native';
import React from 'react';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import AppListPickerItem from '../../molecules/listpicker/AppListPickerItem';
import AppListPickerMenu from '../../molecules/listpicker/AppListPickerMenu';
import { PickerItem } from '../../../types/screen/PickerItem';

interface AppUtilityPickerProps {
  value?: string;
  onSelected?: (item: PickerItem) => void;
}

export default function AppUtilityPicker({
  value,
  onSelected,
}: AppUtilityPickerProps) {
  const [utilitySelectorVisible, setUtilitySelectorVisible] =
    React.useState<boolean>(false);

  const utilityItem: PickerItem[] = React.useMemo(
    () => [
      {
        value: 'content',
        icon: iconMap.utilityContent,
        title: 'Exclusive Content',
        description: 'Description of Exclusive Content',
        disabled: false,
      },
      {
        value: 'videocall',
        icon: iconMap.utilityVideoCall,
        title: 'Video Call',
        description: 'Description of Video Call',
        disabled: false,
      },
      {
        value: 'chat',
        icon: iconMap.utilityChat,
        title: 'Exclusive Chat',
        description: 'Description of Exclusive Chat',
        disabled: true,
      },
      {
        value: 'gift',
        icon: iconMap.utilityGift,
        title: 'Physical Gift',
        description: 'Description of Physical Gift',
        disabled: true,
      },
      {
        value: 'qr',
        icon: iconMap.utilityQR,
        title: 'QR Code',
        description: 'Description of QR Code',
        disabled: true,
      },
      {
        value: 'stream',
        icon: iconMap.utilityStream,
        title: 'Live Stream',
        description: 'Description of Live Stream',
        disabled: true,
      },
    ],
    [],
  );

  const utilitySelector: PickerItem = React.useMemo(
    () => ({
      value: undefined,
      icon: iconMap.add,
      title: 'Select Utility',
      description: 'Set intrinsic value of your NFT!',
    }),
    [],
  );

  const selectedIndex: number | undefined = React.useMemo(() => {
    if (value) {
      for (let i = 0; i < utilityItem.length; i++) {
        if (utilityItem[i].value === value) {
          return i;
        }
      }
      return undefined;
    }
    return undefined;
  }, [value, utilityItem]);

  return (
    <View>
      {value && selectedIndex !== undefined ? (
        <AppListPickerItem
          showDropDown
          onPress={() => setUtilitySelectorVisible(!utilitySelectorVisible)}
          icon={utilityItem[selectedIndex].icon}
          title={utilityItem[selectedIndex].title}
          description={utilityItem[selectedIndex].description}
        />
      ) : (
        <AppListPickerItem
          showDropDown
          onPress={() => setUtilitySelectorVisible(!utilitySelectorVisible)}
          icon={utilitySelector.icon}
          title={utilitySelector.title}
          description={utilitySelector.description}
        />
      )}

      <AppListPickerMenu
        items={utilityItem}
        visible={utilitySelectorVisible}
        onDismiss={() => setUtilitySelectorVisible(false)}
        onSelected={item => {
          onSelected && onSelected(item);
        }}
      />
    </View>
  );
}
