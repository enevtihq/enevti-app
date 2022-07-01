import React from 'react';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppListPickerItem from './AppListPickerItem';
import { PickerItem } from 'enevti-app/types/ui/screen/PickerItem';

interface AppListPickerMenuProps {
  items: PickerItem[];
  visible: boolean;
  onDismiss: () => void;
  onSelected?: (item: PickerItem) => void;
  left?: (item: PickerItem) => React.ReactNode;
}

export default function AppListPickerMenu({ items, left, visible, onDismiss, onSelected }: AppListPickerMenuProps) {
  const snapPoints = items.length * 8.75 + 3.5;

  return (
    <AppMenuContainer tapEverywhereToDismiss snapPoints={[`${snapPoints}%`]} visible={visible} onDismiss={onDismiss}>
      {items.map(item => (
        <AppListPickerItem
          key={item.value}
          onPress={() => {
            onSelected && onSelected(item);
            onDismiss();
          }}
          left={left ? left(item) : undefined}
          icon={item.icon}
          title={item.title}
          description={item.description}
          disabled={item.disabled}
        />
      ))}
    </AppMenuContainer>
  );
}
