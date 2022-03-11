import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppFormTextInputWithError from '../../molecules/AppFormTextInputWithError';
import { TouchableRipple, useTheme } from 'react-native-paper';
import AppIconComponent, { iconMap } from '../../atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppWheelPicker from '../../molecules/wheelpicker/AppWheelPicker';
import AppMenuContainer from '../../atoms/menu/AppMenuContainer';

interface AppDatePickerProps {
  label: string;
  onSelected?: (value: number[]) => void;
  onCancel?: (value: number[]) => void;
  value?: number[];
}

export default function AppDatePicker({
  label,
  onSelected,
  onCancel,
  value,
}: AppDatePickerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const [pickerData, setPickerData] = React.useState<any>();

  const dateIndex: number[] = React.useMemo(() => {
    const arr = Array.from(Array(29).keys());
    arr.shift();
    return arr;
  }, []);

  const pickerValue = React.useMemo(
    () => [value && value[0] !== -1 ? value[0] : ''],
    [value],
  );

  const valueToString = React.useMemo(
    () =>
      value && value[0] !== -1
        ? `${value[0].toString()}${
            value[0] === 1
              ? 'st'
              : value[0] === 2
              ? 'nd'
              : value[0] === 3
              ? 'rd'
              : 'th'
          }`
        : undefined,
    [value],
  );

  React.useEffect(() => {
    setPickerData(dateIndex);
  }, [dateIndex]);

  return (
    <View>
      <AppFormTextInputWithError
        label={label}
        theme={theme}
        dense={true}
        value={valueToString}
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

      <AppMenuContainer
        snapPoints={['45%']}
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}>
        <AppWheelPicker
          onSelected={data => {
            onSelected && onSelected([data[0]]);
            setMenuVisible(false);
          }}
          onCancel={data => {
            onCancel && onCancel([data[0]]);
            setMenuVisible(false);
          }}
          items={pickerData}
          value={pickerValue}
        />
      </AppMenuContainer>
    </View>
  );
}

const makeStyle = (theme: any, insets: SafeAreaInsets) =>
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
