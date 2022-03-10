import { View } from 'react-native';
import React from 'react';
import { iconMap } from '../../atoms/icon/AppIconComponent';
import AppMenuContainer from '../../atoms/menu/AppMenuContainer';
import AppUtilityPickerItem from './AppUtilityPickerItem';
import { UtilityItem } from '../../../types/screen/UtilityItem';

interface AppUtilityPickerProps {
  onSelected?: (item: UtilityItem) => void;
}

export default function AppUtilityPicker({
  onSelected,
}: AppUtilityPickerProps) {
  const [selectedUtility, setSelectedUtility] = React.useState<UtilityItem>();
  const [utilitySelectorVisible, setUtilitySelectorVisible] =
    React.useState<boolean>(false);

  const utilityItem: UtilityItem[] = React.useMemo(
    () => [
      {
        name: 'content',
        icon: iconMap.utilityContent,
        title: 'Exclusive Content',
        description: 'Description of Exclusive Content',
        disabled: false,
      },
      {
        name: 'videocall',
        icon: iconMap.utilityVideoCall,
        title: 'Video Call',
        description: 'Description of Video Call',
        disabled: true,
      },
      {
        name: 'chat',
        icon: iconMap.utilityChat,
        title: 'Exclusive Chat',
        description: 'Description of Exclusive Chat',
        disabled: true,
      },
      {
        name: 'gift',
        icon: iconMap.utilityGift,
        title: 'Physical Gift',
        description: 'Description of Physical Gift',
        disabled: true,
      },
      {
        name: 'qr',
        icon: iconMap.utilityQR,
        title: 'QR Code',
        description: 'Description of QR Code',
        disabled: true,
      },
      {
        name: 'stream',
        icon: iconMap.utilityStream,
        title: 'Live Stream',
        description: 'Description of Live Stream',
        disabled: true,
      },
    ],
    [],
  );

  const utilitySelector: UtilityItem = React.useMemo(
    () => ({
      name: undefined,
      icon: iconMap.add,
      title: 'Select Utility',
      description: 'Set intrinsic value of your NFT!',
    }),
    [],
  );

  return (
    <View>
      {selectedUtility ? (
        <AppUtilityPickerItem
          showDropDown
          onPress={() => setUtilitySelectorVisible(true)}
          icon={selectedUtility.icon}
          title={selectedUtility.title}
          description={selectedUtility.description}
        />
      ) : (
        <AppUtilityPickerItem
          showDropDown
          onPress={() => setUtilitySelectorVisible(true)}
          icon={utilitySelector.icon}
          title={utilitySelector.title}
          description={utilitySelector.description}
        />
      )}

      <AppMenuContainer
        tapEverywhereToDismiss
        snapPoints={['60%']}
        visible={utilitySelectorVisible}
        onDismiss={() => setUtilitySelectorVisible(false)}>
        {utilityItem.map(item => (
          <AppUtilityPickerItem
            key={item.name}
            onPress={() => {
              setSelectedUtility(item);
              onSelected && onSelected(item);
              setUtilitySelectorVisible(false);
            }}
            icon={item.icon}
            title={item.title}
            description={item.description}
            disabled={item.disabled}
          />
        ))}
      </AppMenuContainer>
    </View>
  );
}
