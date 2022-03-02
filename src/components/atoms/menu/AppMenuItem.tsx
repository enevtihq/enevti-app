import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import React from 'react';
import { Menu, useTheme } from 'react-native-paper';
import { Theme } from '../../../theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';

interface AppMenuItemProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  titleStyle?: StyleProp<TextStyle>;
}

export default function AppMenuItem({
  onPress,
  title,
  disabled = false,
  titleStyle,
}: AppMenuItemProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyle(theme, insets);

  return (
    <Menu.Item
      onPress={onPress}
      title={title}
      titleStyle={[styles.menuTitle, titleStyle]}
      style={styles.menuItem}
      disabled={disabled}
    />
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    menuTitle: {
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: theme.fonts.regular.fontWeight,
      fontSize: wp('4.0%', insets),
    },
    menuItem: {
      maxWidth: '100%',
    },
  });
