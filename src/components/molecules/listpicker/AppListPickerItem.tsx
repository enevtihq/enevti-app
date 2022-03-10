import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../../theme/default';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';
import AppIconComponent, { iconMap } from '../../atoms/icon/AppIconComponent';
import AppTextBody4 from '../../atoms/text/AppTextBody4';
import AppTextHeading3 from '../../atoms/text/AppTextHeading3';
import AppIconGradient from '../../molecules/AppIconGradient';
import AppListItem from '../../molecules/list/AppListItem';

interface AppListPickerItemProps {
  onPress: () => void;
  icon: string;
  title: string;
  description: string;
  showDropDown?: boolean;
  disabled?: boolean;
}

export default function AppListPickerItem({
  onPress,
  icon,
  title,
  description,
  showDropDown = false,
  disabled = false,
}: AppListPickerItemProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(insets);

  return (
    <AppListItem
      disabled={disabled}
      onPress={onPress}
      leftContent={
        <AppIconGradient
          name={icon}
          androidRenderingMode={'software'}
          colors={[theme.colors.primary, theme.colors.secondary]}
          size={30}
          style={styles.listIcon}
        />
      }
      rightContent={
        showDropDown ? (
          <AppIconComponent
            name={iconMap.dropDown}
            color={theme.colors.placeholder}
            size={30}
            style={styles.listDropDown}
          />
        ) : null
      }>
      <AppTextHeading3 numberOfLines={1} style={{ width: wp('50%', insets) }}>
        {title}
      </AppTextHeading3>
      <AppTextBody4
        style={{ color: theme.colors.placeholder }}
        numberOfLines={1}>
        {description}
      </AppTextBody4>
    </AppListItem>
  );
}

const makeStyle = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    listIcon: {
      marginRight: wp('3%', insets),
      alignSelf: 'center',
    },
    listDropDown: {
      marginLeft: wp('3%', insets),
      alignSelf: 'center',
    },
  });
