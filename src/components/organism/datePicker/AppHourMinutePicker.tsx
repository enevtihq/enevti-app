import React from 'react';
import { shallowEqual } from 'react-redux';
import AppFormWheelPicker from 'enevti-app/components/molecules/wheelpicker/AppFormWheelPicker';

interface AppHourMinutePickerProps {
  label: string;
  onSelected?: (value: number[]) => void;
  onCancel?: (value: number[]) => void;
  value?: number[];
  memoKey?: (keyof AppHourMinutePickerProps)[];
}

function Component({
  label,
  onSelected,
  onCancel,
  value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppHourMinutePickerProps) {
  const [pickerData, setPickerData] = React.useState<string[][]>();

  const hourIndex = React.useMemo(() => Array.from(Array(24).keys()), []);
  const minuteIndex = React.useMemo(() => Array.from(Array(60).keys()), []);

  const hourStringIndex = React.useMemo(() => hourIndex.map(item => ('0' + item.toString()).slice(-2)), [hourIndex]);
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
        ? `${('0' + value[0].toString()).slice(-2)} : ${('0' + value[1].toString()).slice(-2)}`
        : undefined,
    [value],
  );

  React.useEffect(() => {
    setPickerData([hourStringIndex, minuteStringIndex]);
  }, [hourStringIndex, minuteStringIndex]);

  return (
    <AppFormWheelPicker
      label={label}
      items={pickerData}
      value={valueToString}
      pickerValue={pickerValue}
      onSelected={data => onSelected && onSelected([parseFloat(data[0]), parseFloat(data[1])])}
      onCancel={data => onCancel && onCancel([parseFloat(data[0]), parseFloat(data[1])])}
    />
  );
}

const AppHourMinutePicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppHourMinutePicker;
