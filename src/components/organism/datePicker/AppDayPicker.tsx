import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppFormTextInputWithError from '../../molecules/AppFormTextInputWithError';
import { TouchableRipple, useTheme } from 'react-native-paper';
import AppIconComponent, { iconMap } from '../../atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppWheelPicker from '../../molecules/wheelpicker/AppWheelPicker';
import AppMenuContainer from '../../atoms/menu/AppMenuContainer';
import { dayToString } from '../../../utils/date/dateToString';

interface AppDayPickerProps {
  onSelected?: (value: number[]) => void;
  onCancel?: (value: number[]) => void;
  value?: number[];
}

export default function AppDayPicker({
  onSelected,
  onCancel,
  value,
}: AppDayPickerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const [pickerData, setPickerData] = React.useState<any>();

  const dayIndex = React.useMemo(() => Array.from(Array(7).keys()), []);
  const dayStringIndex = React.useMemo(
    () => dayIndex.map(day => dayToString(day)),
    [dayIndex],
  );

  const pickerValue = React.useMemo(
    () => [value && value[0] !== -1 ? dayToString(value[0]) : ''],
    [value],
  );

  const valueToString = React.useMemo(
    () => (value && value[0] !== -1 ? `${dayToString(value[0])}` : undefined),
    [value],
  );

  React.useEffect(() => {
    setPickerData(dayStringIndex);
  }, [dayStringIndex]);

  return (
    <View>
      <AppFormTextInputWithError
        label={'Redeem Day'}
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
            onSelected && onSelected([dayStringIndex.indexOf(data[0])]);
            setMenuVisible(false);
          }}
          onCancel={data => {
            onCancel && onCancel([dayStringIndex.indexOf(data[0])]);
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
