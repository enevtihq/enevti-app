import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppFormTextInputWithError from 'enevti-app/components/molecules/form/AppFormTextInputWithError';
import { TouchableRipple, useTheme } from 'react-native-paper';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { shallowEqual } from 'react-redux';
import AppMenuContainer from 'enevti-app/components/atoms/menu/AppMenuContainer';
import AppWheelPicker from './AppWheelPicker';

interface AppFormWheelPickerProps {
  label: string;
  items: any;
  pickerValue: string[];
  value?: string;
  onSelected?: (value: string[]) => void;
  onCancel?: (value: string[]) => void;
  onChange?: (data: any, index: number) => void;
  memoKey?: (keyof AppFormWheelPickerProps)[];
}

function Component({
  label,
  items,
  pickerValue,
  value,
  onSelected,
  onCancel,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppFormWheelPickerProps) {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  return (
    <View>
      <AppFormTextInputWithError
        memoKey={['label', 'value']}
        label={label}
        theme={theme}
        dense={true}
        value={value}
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

      <AppMenuContainer snapPoints={['45%']} visible={menuVisible} onDismiss={() => setMenuVisible(false)}>
        <AppWheelPicker
          onSelected={data => {
            onSelected && onSelected(data);
            setMenuVisible(false);
          }}
          onCancel={data => {
            onCancel && onCancel(data);
            setMenuVisible(false);
          }}
          onChange={onChange}
          items={items}
          value={pickerValue}
        />
      </AppMenuContainer>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    formInput: {
      marginBottom: hp('1%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
    },
    dropDownIcon: {
      justifyContent: 'center',
      height: '100%',
      width: wp('10%'),
    },
    inputRippleContainer: {
      ...StyleSheet.absoluteFillObject,
      marginBottom: hp('1%'),
      marginLeft: wp('5%'),
      marginRight: wp('5%'),
      marginTop: wp('2%'),
      borderRadius: theme.roundness,
      overflow: 'hidden',
    },
    inputRipple: {
      width: '100%',
      height: '100%',
    },
  });

const AppFormWheelPicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppFormWheelPicker;
