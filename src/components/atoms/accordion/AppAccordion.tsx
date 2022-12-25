import React from 'react';
import { List } from 'react-native-paper';
import { shallowEqual } from 'react-redux';
import { wp } from 'enevti-app/utils/layout/imageRatio';
import { StyleProp, TextStyle } from 'react-native';

interface AppAccordionProps {
  children: React.ReactNode;
  title: React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  expanded?: boolean;
  onPress?: () => void;
  memoKey?: (keyof AppAccordionProps)[];
}

function Component({
  title,
  titleStyle,
  expanded,
  children,
  onPress,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppAccordionProps) {
  return (
    <List.Accordion
      title={title}
      titleStyle={[{ marginLeft: wp('2%') }, titleStyle]}
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
