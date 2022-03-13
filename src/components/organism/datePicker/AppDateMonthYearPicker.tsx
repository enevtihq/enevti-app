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

interface AppDateMonthYearPickerProps {
  label: string;
  onSelected?: (value: number[]) => void;
  onCancel?: (value: number[]) => void;
  value?: number[];
}

export default function AppDateMonthYearPicker({
  label,
  onSelected,
  onCancel,
  value,
}: AppDateMonthYearPickerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);
  const currentDate = React.useMemo(() => new Date(), []);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  const [dateData, setDateData] = React.useState<number[]>([0]);
  const [monthData, setMonthData] = React.useState<string[]>(['']);
  const [pickerValue, setPickerValue] = React.useState<any[]>([]);

  const yearIndex = React.useMemo(
    () => [...Array(51).keys()].map(x => x + currentDate.getUTCFullYear()),
    [currentDate],
  );

  const monthStringIndex = React.useMemo(
    () => Array.from(Array(12).keys()).map(month => monthToString(month)!),
    [],
  );

  const valueToString = React.useMemo(
    () =>
      value && value[0] !== -1 && value[1] !== -1 && value[2] !== -1
        ? `${monthToString(value[1])} ${value[2].toString()}${
            value[2] === 1
              ? 'st'
              : value[2] === 2
              ? 'nd'
              : value[2] === 3
              ? 'rd'
              : 'th'
          }, ${value[0]}`
        : undefined,
    [value],
  );

  const onChange = React.useCallback(
    (data: any, index: number) => {
      if (index === 1 || index === 0) {
        const currentMonth = currentDate.getUTCMonth();
        const currentDay = currentDate.getUTCDate();
        const currentDayInMonth = getDaysInMonthUTC(currentMonth).length + 1;
        if (index === 1) {
          if (
            data[0] === currentDate.getUTCFullYear() &&
            data[1] === monthToString(currentMonth)
          ) {
            setDateData(
              [...Array(currentDayInMonth - currentDay).keys()].map(
                x => x + currentDay,
              ),
            );
          } else {
            setDateData(
              getDaysInMonthUTC(monthStringIndex.indexOf(data[1]), data[0]),
            );
          }
        } else {
          if (data[0] === currentDate.getUTCFullYear()) {
            setMonthData(
              [...Array(12 - currentMonth).keys()].map(
                x => monthToString(x + currentMonth)!,
              ),
            );
            setDateData(
              [...Array(currentDayInMonth - currentDay).keys()].map(
                x => x + currentDay,
              ),
            );
          } else {
            setMonthData(monthStringIndex);
            setDateData(
              getDaysInMonthUTC(monthStringIndex.indexOf(data[1]), data[0]),
            );
          }
        }
        setPickerValue([data[0], data[1], data[2]]);
      }
    },
    [currentDate, monthStringIndex],
  );

  React.useEffect(() => {
    const currentMonth = currentDate.getUTCMonth();
    const currentDay = currentDate.getUTCDate();
    const currentDayInMonth = getDaysInMonthUTC(currentMonth).length + 1;
    if (value && value[0] !== -1 && value[1] !== -1 && value[2] !== -1) {
      if (
        value[0] === currentDate.getUTCFullYear() &&
        value[1] === currentMonth
      ) {
        setMonthData(
          [...Array(12 - currentMonth).keys()].map(
            x => monthToString(x + currentMonth)!,
          ),
        );
        setDateData(
          [...Array(currentDayInMonth - currentDay).keys()].map(
            x => x + currentDay,
          ),
        );
      } else {
        setMonthData(monthStringIndex);
        setDateData(getDaysInMonthUTC(value[1], value[0]));
      }
    } else {
      setMonthData(
        [...Array(12 - currentMonth).keys()].map(
          x => monthToString(x + currentMonth)!,
        ),
      );
      setDateData(
        [...Array(currentDayInMonth - currentDay).keys()].map(
          x => x + currentDay,
        ),
      );
    }
    setPickerValue([
      value && value[0] !== -1 ? value[0] : currentDate.getUTCFullYear(),
      value && value[1] !== -1
        ? monthToString(value[1])
        : monthToString(currentMonth),
      value && value[2] !== -1 ? value[2] : currentDay,
    ]);
  }, [currentDate, value, monthStringIndex]);

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
            onSelected &&
              onSelected([data[0], monthStringIndex.indexOf(data[1]), data[2]]);
            setMenuVisible(false);
          }}
          onCancel={data => {
            onCancel &&
              onCancel([data[0], monthStringIndex.indexOf(data[1]), data[2]]);
            setMenuVisible(false);
          }}
          onChange={onChange}
          items={[yearIndex, monthData, dateData]}
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
