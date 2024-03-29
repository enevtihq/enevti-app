import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppIconComponent, { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';
import AppIconGradient from 'enevti-app/components/molecules/icon/AppIconGradient';
import AppListItem from 'enevti-app/components/molecules/list/AppListItem';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

interface AppListPickerItemProps {
  icon: string;
  description: string;
  title?: string;
  onPress?: () => void;
  showDropDown?: boolean;
  dropDownIcon?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
}

export default function AppListPickerItem({
  onPress,
  icon,
  title,
  description,
  showDropDown = false,
  dropDownIcon,
  right,
  left,
  disabled = false,
  loading = false,
  style,
}: AppListPickerItemProps) {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);

  return (
    <AppListItem
      containerStyle={style}
      disabled={disabled}
      onPress={onPress}
      leftContent={
        loading ? undefined : left ? (
          left
        ) : (
          <AppIconGradient
            name={icon}
            androidRenderingMode={'software'}
            colors={[theme.colors.primary, theme.colors.secondary]}
            size={30}
            style={styles.listIcon}
          />
        )
      }
      rightContent={
        loading ? undefined : right ? (
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
      {loading ? (
        <View style={styles.listLoader}>
          <AppActivityIndicator animating />
        </View>
      ) : (
        <View style={styles.listContent}>
          {title ? (
            <AppTextHeading3 numberOfLines={1} style={{ width: wp('50%') }}>
              {title}
            </AppTextHeading3>
          ) : null}
          <AppTextBody4 style={{ color: theme.colors.placeholder }} numberOfLines={1}>
            {description}
          </AppTextBody4>
        </View>
      )}
    </AppListItem>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    listIcon: {
      marginRight: wp('3%'),
      alignSelf: 'center',
    },
    listDropDown: {
      marginLeft: wp('3%'),
      alignSelf: 'center',
    },
    listContent: {
      height: hp('5.5%'),
      justifyContent: 'center',
    },
    listLoader: {
      height: hp('5.5%'),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
