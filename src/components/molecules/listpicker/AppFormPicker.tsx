import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppListPickerMenu from 'enevti-app/components/molecules/listpicker/AppListPickerMenu';
import { PickerItem } from 'enevti-app/types/ui/screen/PickerItem';
import AppFormTextInputWithError from 'enevti-app/components/molecules/form/AppFormTextInputWithError';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { shallowEqual } from 'react-redux';

interface AppFormPickerProps {
  label: string;
  items: PickerItem[];
  value?: string;
  onSelected?: (item: PickerItem) => void;
  memoKey?: (keyof AppFormPickerProps)[];
}

function Component({
  label,
  items,
  value,
  onSelected,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppFormPickerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

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
      <AppFormTextInputWithError
        memoKey={['label', 'value']}
        label={label}
        theme={theme}
        dense={true}
        value={value && selectedIndex !== undefined ? items[selectedIndex].title : undefined}
        style={styles.formInput}
        editable={false}
        pointerEvents={'none'}
        endComponent={
          <AppIconComponent
            name={iconMap.dropDown}
            color={theme.colors.placeholder}
            size={25}
            style={styles.dropDownIcon}
          />
        }
      />

      <View style={styles.inputRippleContainer}>
        <TouchableRipple onPress={() => setMenuVisible(!menuVisible)} style={styles.inputRipple}>
          <View />
        </TouchableRipple>
      </View>

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

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    formInput: {
      marginBottom: hp('1%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
    },
    dropDownIcon: {
      justifyContent: 'center',
      height: '100%',
      width: wp('10%', insets),
    },
    inputRippleContainer: {
      ...StyleSheet.absoluteFillObject,
      marginBottom: hp('1%', insets),
      marginLeft: wp('5%', insets),
      marginRight: wp('5%', insets),
      marginTop: wp('2%', insets),
      borderRadius: theme.roundness,
      overflow: 'hidden',
    },
    inputRipple: {
      width: '100%',
      height: '100%',
    },
  });

const AppFormPicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppFormPicker;
