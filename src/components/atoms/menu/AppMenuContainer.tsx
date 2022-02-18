import React from 'react';
import { Menu } from 'react-native-paper';

interface AppMenuContainerProps {
  visible: boolean;
  onDismiss: () => void;
  anchor: React.ReactNode;
  children: React.ReactNode;
}

export default function AppMenuContainer({
  visible,
  onDismiss,
  anchor,
  children,
}: AppMenuContainerProps) {
  return (
    <Menu visible={visible} onDismiss={onDismiss} anchor={anchor}>
      {children}
    </Menu>
  );
}
