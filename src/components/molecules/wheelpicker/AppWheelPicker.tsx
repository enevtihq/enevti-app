import { StyleSheet } from 'react-native';
import React from 'react';
import { CommonPicker } from '@yz1311/react-native-wheel-picker';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { Theme } from '../../../theme/default';
import { useTranslation } from 'react-i18next';

interface AppWheelPickerProps {
  onSelected?: (value: any) => void;
  onCancel?: (value: any) => void;
  onChange?: (value: any, index: number) => void;
  items?: any;
  value?: any;
}

export default function AppWheelPicker({
  onSelected,
  onCancel,
  onChange,
  items,
  value,
}: AppWheelPickerProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets);

  return (
    <CommonPicker
      onPickerConfirm={onSelected}
      onPickerCancel={onCancel}
      pickerData={items}
      selectedValue={value}
      pickerCancelBtnText={t('form:cancel')}
      pickerConfirmBtnText={t('form:choose')}
      pickerToolBarStyle={{
        backgroundColor: theme.colors.background,
        borderBottomWidth: undefined,
      }}
      style={{ backgroundColor: theme.colors.background }}
      itemStyle={styles.pickerItem}
      pickerConfirmBtnTextStyle={[
        styles.pickerText,
        { color: theme.colors.primary },
      ]}
      pickerCancelBtnTextStyle={styles.pickerText}
      onValueChange={onChange}
    />
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    pickerText: {
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: theme.fonts.regular.fontWeight,
      fontSize: wp('4.0%', insets),
    },
    pickerItem: {
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: theme.fonts.regular.fontWeight,
      fontSize: wp('5.2%', insets),
      color: theme.colors.text,
    },
  });
