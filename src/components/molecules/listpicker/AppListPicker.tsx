import { StyleSheet, View } from 'react-native';
import React from 'react';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppListPickerItem from 'enevti-app/components/molecules/listpicker/AppListPickerItem';
import AppListPickerMenu from 'enevti-app/components/molecules/listpicker/AppListPickerMenu';
import { PickerItem } from 'enevti-app/types/screen/PickerItem';
import { shallowEqual } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import Color from 'color';

interface AppListPickerProps {
  items: PickerItem[];
  label: string;
  subLabel: string;
  value?: string;
  onSelected?: (item: PickerItem) => void;
  memoKey?: (keyof AppListPickerProps)[];
}

function Component({
  items,
  label,
  subLabel,
  value,
  onSelected,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppListPickerProps) {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
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
          style={styles.pickerItem}
        />
      ) : (
        <AppListPickerItem
          showDropDown
          onPress={() => setMenuVisible(!menuVisible)}
          icon={iconMap.add}
          title={label}
          description={subLabel}
          style={styles.pickerItem}
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

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    pickerItem: {
      backgroundColor: theme.dark
        ? Color(theme.colors.background).lighten(0.5).rgb().string()
        : Color(theme.colors.background).darken(0.04).rgb().string(),
    },
  });

const AppListPicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppListPicker;
