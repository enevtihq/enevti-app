import React from 'react';
import { shallowEqual } from 'react-redux';
import { dayToString } from 'enevti-app/utils/date/dateToString';
import AppFormWheelPicker from 'enevti-app/components/molecules/wheelpicker/AppFormWheelPicker';

interface AppDayPickerProps {
  label: string;
  onSelected?: (value: number[]) => void;
  onCancel?: (value: number[]) => void;
  value?: number[];
  memoKey?: (keyof AppDayPickerProps)[];
}

function Component({
  label,
  onSelected,
  onCancel,
  value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppDayPickerProps) {
  const [pickerData, setPickerData] = React.useState<any>();

  const dayIndex = React.useMemo(() => Array.from(Array(7).keys()), []);
  const dayStringIndex = React.useMemo(
    () => dayIndex.map(day => dayToString(day)),
    [dayIndex],
  );

  const pickerValue = React.useMemo(
    () => [value && value[0] !== -1 ? dayToString(value[0])! : ''],
    [value],
  );

  const valueToString = React.useMemo(
    () => (value && value[0] !== -1 ? `${dayToString(value[0])!}` : undefined),
    [value],
  );

  React.useEffect(() => {
    setPickerData(dayStringIndex);
  }, [dayStringIndex]);

  return (
    <AppFormWheelPicker
      label={label}
      items={pickerData}
      value={valueToString}
      pickerValue={pickerValue}
      onSelected={data =>
        onSelected && onSelected([dayStringIndex.indexOf(data[0])])
      }
      onCancel={data => onCancel && onCancel([dayStringIndex.indexOf(data[0])])}
    />
  );
}

const AppDayPicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppDayPicker;
