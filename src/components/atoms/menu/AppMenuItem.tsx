import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import React from 'react';
import { Menu, useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';

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
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

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

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    menuTitle: {
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: theme.fonts.regular.fontWeight,
      fontSize: wp('4.0%'),
      width: '200%',
    },
    menuItem: {
      maxWidth: '100%',
      height: hp(MENU_ITEM_HEIGHT_PERCENTAGE),
    },
  });
