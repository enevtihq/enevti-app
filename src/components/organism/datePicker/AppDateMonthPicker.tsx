import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppFormTextInputWithError from '../../molecules/AppFormTextInputWithError';
import { TouchableRipple, useTheme } from 'react-native-paper';
import AppIconComponent, { iconMap } from '../../atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppWheelPicker from '../../molecules/wheelpicker/AppWheelPicker';
import AppMenuContainer from '../../atoms/menu/AppMenuContainer';
import { monthToString } from '../../../utils/date/dateToString';
import getDaysInMonthUTC from '../../../utils/date/getDaysInMonth';

interface AppDateMonthPickerProps {
  onSelected?: (value: number[]) => void;
  onCancel?: (value: number[]) => void;
  value?: number[];
}

export default function AppDateMonthPicker({
  onSelected,
  onCancel,
  value,
}: AppDateMonthPickerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const [pickerData, setPickerData] = React.useState<any>();

  const monthIndex = React.useMemo(() => Array.from(Array(12).keys()), []);
  const monthStringIndex = React.useMemo(
    () => monthIndex.map(month => monthToString(month)),
    [monthIndex],
  );

  const pickerValue = React.useMemo(
    () => [
      value ? monthToString(value[0]) : '',
      value ? value[1].toString() : '',
    ],
    [value],
  );

  const valueToString = React.useMemo(
    () =>
      value && value[1] !== 0
        ? `${monthToString(value[0])} ${value[1].toString()}${
            value[1] === 1
              ? 'st'
              : value[1] === 2
              ? 'nd'
              : value[1] === 3
              ? 'rd'
              : 'th'
          }`
        : undefined,
    [value],
  );

  React.useEffect(() => {
    let data: any = {};
    for (const month in monthIndex) {
      data[monthToString(parseFloat(month))!] = getDaysInMonthUTC(
        parseFloat(month),
      );
    }
    setPickerData(data);
  }, [monthIndex]);

  return (
    <View>
      <AppFormTextInputWithError
        label={'Redeem Date & Month'}
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
            onSelected &&
              onSelected([monthStringIndex.indexOf(data[0]), data[1]]);
            setMenuVisible(false);
          }}
          onCancel={data => {
            onCancel && onCancel([monthStringIndex.indexOf(data[0]), data[1]]);
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
