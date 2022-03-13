import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppIconComponent, { iconMap } from '../../atoms/icon/AppIconComponent';
import AppListPickerMenu from '../../molecules/listpicker/AppListPickerMenu';
import { PickerItem } from '../../../types/screen/PickerItem';
import AppFormTextInputWithError from '../../molecules/AppFormTextInputWithError';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from 'react-native-paper/lib/typescript/types';

interface AppFormPickerProps {
  label: string;
  items: PickerItem[];
  value?: string;
  onSelected?: (item: PickerItem) => void;
}

export default function AppFormPicker({
  label,
  items,
  value,
  onSelected,
}: AppFormPickerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

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
        label={label}
        theme={theme}
        dense={true}
        value={
          value && selectedIndex !== undefined
            ? items[selectedIndex].title
            : undefined
        }
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
        <TouchableRipple
          onPress={() => setMenuVisible(!menuVisible)}
          style={styles.inputRipple}>
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

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
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
