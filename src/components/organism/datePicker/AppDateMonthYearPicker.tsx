import React from 'react';
import { shallowEqual } from 'react-redux';
import { monthToString } from 'enevti-app/utils/date/dateToString';
import getDaysInMonthUTC from 'enevti-app/utils/date/getDaysInMonth';
import AppFormWheelPicker from 'enevti-app/components/molecules/wheelpicker/AppFormWheelPicker';
import { ordinalWithSuffix } from 'enevti-app/utils/format/number';

interface AppDateMonthYearPickerProps {
  label: string;
  onSelected?: (value: number[]) => void;
  onCancel?: (value: number[]) => void;
  value?: number[];
  memoKey?: (keyof AppDateMonthYearPickerProps)[];
}

function Component({
  label,
  onSelected,
  onCancel,
  value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppDateMonthYearPickerProps) {
  const currentDate = React.useMemo(() => new Date(), []);

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
        ? `${monthToString(value[1])} ${ordinalWithSuffix(value[2])}, ${
            value[0]
          }`
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
    <AppFormWheelPicker
      label={label}
      items={[yearIndex, monthData, dateData]}
      value={valueToString}
      pickerValue={pickerValue}
      onChange={onChange}
      onSelected={data =>
        onSelected &&
        onSelected([
          parseFloat(data[0]),
          monthStringIndex.indexOf(data[1]),
          parseFloat(data[2]),
        ])
      }
      onCancel={data =>
        onCancel &&
        onCancel([
          parseFloat(data[0]),
          monthStringIndex.indexOf(data[1]),
          parseFloat(data[2]),
        ])
      }
    />
  );
}

const AppDateMonthYearPicker = React.memo(Component, (prevProps, nextProps) => {
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
export default AppDateMonthYearPicker;
