import React from 'react';
import { shallowEqual } from 'react-redux';
import AppFormWheelPicker from '../../molecules/wheelpicker/AppFormWheelPicker';

interface AppDatePickerProps {
  label: string;
  onSelected?: (value: number[]) => void;
  onCancel?: (value: number[]) => void;
  value?: number[];
  memoKey?: (keyof AppDatePickerProps)[];
}

function Component({
  label,
  onSelected,
  onCancel,
  value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppDatePickerProps) {
  const [pickerData, setPickerData] = React.useState<any>();

  const dateIndex: number[] = React.useMemo(() => {
    const arr = Array.from(Array(29).keys());
    arr.shift();
    return arr;
  }, []);

  const pickerValue = React.useMemo(
    () => [value && value[0] !== -1 ? value[0].toString() : ''],
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
    <AppFormWheelPicker
      label={label}
      items={pickerData}
      value={valueToString}
      pickerValue={pickerValue}
      onSelected={data => onSelected && onSelected([parseFloat(data[0])])}
      onCancel={data => onCancel && onCancel([parseFloat(data[0])])}
    />
  );
}

const AppDatePicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppDatePicker;
