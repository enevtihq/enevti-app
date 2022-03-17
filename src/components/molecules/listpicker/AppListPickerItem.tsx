import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
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
  icon: string;
  title: string;
  description: string;
  onPress?: () => void;
  showDropDown?: boolean;
  dropDownIcon?: string;
  right?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function AppListPickerItem({
  onPress,
  icon,
  title,
  description,
  showDropDown = false,
  dropDownIcon,
  right,
  disabled = false,
  style,
}: AppListPickerItemProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  return (
    <AppListItem
      containerStyle={style}
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
        right ? (
          right
        ) : showDropDown ? (
          <AppIconComponent
            name={dropDownIcon ? dropDownIcon : iconMap.dropDown}
            color={theme.colors.placeholder}
            size={25}
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

const makeStyles = (insets: SafeAreaInsets) =>
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
