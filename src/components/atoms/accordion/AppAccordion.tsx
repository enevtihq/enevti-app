import React from 'react';
import { List } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shallowEqual } from 'react-redux';
import { wp } from 'enevti-app/utils/imageRatio';

interface AppAccordionProps {
  children: React.ReactNode;
  title: React.ReactNode;
  expanded?: boolean;
  onPress?: () => void;
  memoKey?: (keyof AppAccordionProps)[];
}

function Component({
  title,
  expanded,
  children,
  onPress,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppAccordionProps) {
  const insets = useSafeAreaInsets();

  return (
    <List.Accordion
      title={title}
      titleStyle={{ marginLeft: wp('2%', insets) }}
      expanded={expanded}
      onPress={onPress}>
      {children}
    </List.Accordion>
  );
}

const AppAccordion = React.memo(Component, (prevProps, nextProps) => {
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
export default AppAccordion;
