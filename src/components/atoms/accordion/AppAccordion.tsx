import React from 'react';
import { List } from 'react-native-paper';

interface AppAccordionProps {
  children: React.ReactNode;
  title: React.ReactNode;
  expanded?: boolean;
  onPress?: () => void;
}

export default function AppAccordion({
  title,
  expanded,
  children,
  onPress,
}: AppAccordionProps) {
  return (
    <List.Accordion title={title} expanded={expanded} onPress={onPress}>
      {children}
    </List.Accordion>
  );
}
