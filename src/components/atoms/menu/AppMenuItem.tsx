import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import React from 'react';
import { Menu, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/layout/imageRatio';

export const MENU_ITEM_HEIGHT_PERCENTAGE = 6;

interface AppMenuItemProps {
  onPress: () => void;
  title: string;
  icon?: string;
  disabled?: boolean;
  titleStyle?: StyleProp<TextStyle>;
}

export default function AppMenuItem({ onPress, title, icon, disabled = false, titleStyle }: AppMenuItemProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => makeStyles(theme, insets), [theme, insets]);

  return (
    <Menu.Item
      onPress={onPress}
      icon={icon}
      title={title}
      titleStyle={[styles.menuTitle, titleStyle]}
      style={styles.menuItem}
      disabled={disabled}
    />
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    menuTitle: {
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: theme.fonts.regular.fontWeight,
      fontSize: wp('4.0%', insets),
      width: '200%',
    },
    menuItem: {
      maxWidth: '100%',
      height: hp(MENU_ITEM_HEIGHT_PERCENTAGE, insets),
    },
  });
