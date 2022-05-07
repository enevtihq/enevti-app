import React from 'react';
import { shallowEqual } from 'react-redux';
import { monthToString } from 'enevti-app/utils/date/dateToString';
import getDaysInMonthUTC from 'enevti-app/utils/date/getDaysInMonth';
import AppFormWheelPicker from 'enevti-app/components/molecules/wheelpicker/AppFormWheelPicker';
import { ordinalWithSuffix } from 'enevti-app/utils/format/number';

interface AppDateMonthPickerProps {
  label: string;
  onSelected?: (value: number[]) => void;
  onCancel?: (value: number[]) => void;
  value?: number[];
  memoKey?: (keyof AppDateMonthPickerProps)[];
}

function Component({
  label,
  onSelected,
  onCancel,
  value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppDateMonthPickerProps) {
  const [pickerData, setPickerData] = React.useState<any>();

  const monthIndex = React.useMemo(() => Array.from(Array(12).keys()), []);
  const monthStringIndex = React.useMemo(
    () => monthIndex.map(month => monthToString(month)),
    [monthIndex],
  );

  const pickerValue: string[] = React.useMemo(
    () => [
      value && value[0] !== -1 ? monthToString(value[0])! : '',
      value && value[1] !== -1 ? value[1].toString() : '',
    ],
    [value],
  );

  const valueToString = React.useMemo(
    () =>
      value && value[0] !== -1 && value[1] !== -1
        ? `${monthToString(value[0])} ${ordinalWithSuffix(value[1])}`
        : undefined,
    [value],
  );

  React.useEffect(() => {
    let data: any = {};
    for (const month in monthIndex) {
      data[monthToString(parseFloat(month))!] = getDaysInMonthUTC(parseFloat(month));
    }
    setPickerData(data);
  }, [monthIndex]);

  return (
    <AppFormWheelPicker
      label={label}
      items={pickerData}
      value={valueToString}
      pickerValue={pickerValue}
      onSelected={data =>
        onSelected && onSelected([monthStringIndex.indexOf(data[0]), parseFloat(data[1])])
      }
      onCancel={data =>
        onCancel && onCancel([monthStringIndex.indexOf(data[0]), parseFloat(data[1])])
      }
    />
  );
}

const AppDateMonthPicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppDateMonthPicker;
