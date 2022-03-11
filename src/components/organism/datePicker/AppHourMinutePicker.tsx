import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppFormTextInputWithError from '../../molecules/AppFormTextInputWithError';
import { TouchableRipple, useTheme } from 'react-native-paper';
import AppIconComponent, { iconMap } from '../../atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppWheelPicker from '../../molecules/wheelpicker/AppWheelPicker';
import AppMenuContainer from '../../atoms/menu/AppMenuContainer';

interface AppHourMinutePickerProps {
  label: string;
  onSelected?: (value: number[]) => void;
  onCancel?: (value: number[]) => void;
  value?: number[];
}

export default function AppHourMinutePicker({
  label,
  onSelected,
  onCancel,
  value,
}: AppHourMinutePickerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const [pickerData, setPickerData] = React.useState<string[][]>();

  const hourIndex = React.useMemo(() => Array.from(Array(24).keys()), []);
  const minuteIndex = React.useMemo(() => Array.from(Array(60).keys()), []);

  const hourStringIndex = React.useMemo(
    () => hourIndex.map(item => ('0' + item.toString()).slice(-2)),
    [hourIndex],
  );
  const minuteStringIndex = React.useMemo(
    () => minuteIndex.map(item => ('0' + item.toString()).slice(-2)),
    [minuteIndex],
  );

  const pickerValue = React.useMemo(
    () => [
      value && value[0] !== -1 ? ('0' + value[0].toString()).slice(-2) : '',
      value && value[1] !== -1 ? ('0' + value[1].toString()).slice(-2) : '',
    ],
    [value],
  );

  const valueToString = React.useMemo(
    () =>
      value && value[0] !== -1 && value[1] !== -1
        ? `${('0' + value[0].toString()).slice(-2)} : ${(
            '0' + value[1].toString()
          ).slice(-2)}`
        : undefined,
    [value],
  );

  React.useEffect(() => {
    setPickerData([hourStringIndex, minuteStringIndex]);
  }, [hourStringIndex, minuteStringIndex]);

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
              onSelected([parseFloat(data[0]), parseFloat(data[1])]);
            setMenuVisible(false);
          }}
          onCancel={data => {
            onCancel && onCancel([parseFloat(data[0]), parseFloat(data[1])]);
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
