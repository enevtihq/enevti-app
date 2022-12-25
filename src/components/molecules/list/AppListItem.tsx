import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import Color from 'color';
import { Theme } from 'enevti-app/theme/default';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import { TouchableRipple } from 'react-native-paper';

export const LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE = 1;

interface AppListItemProps {
  children: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onPress?: () => void;
}

export default function AppListItem({
  children,
  disabled = false,
  style,
  containerStyle,
  leftContent,
  rightContent,
  onPress,
}: AppListItemProps) {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  const opacity = disabled ? 0.5 : undefined;

  return (
    <View style={[styles.listContainer, { opacity }, containerStyle]}>
      <TouchableRipple onPress={disabled ? undefined : onPress}>
        <View style={[styles.itemContainer, style]}>
          {leftContent}
          <View style={styles.contentContainer}>{children}</View>
          {rightContent}
        </View>
      </TouchableRipple>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    listContainer: {
      marginHorizontal: wp('5%'),
      marginVertical: hp(LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE / 2),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
      overflow: 'hidden',
    },
    itemContainer: {
      flexDirection: 'row',
      paddingVertical: wp('2%'),
      paddingHorizontal: wp('3%'),
    },
    contentContainer: { justifyContent: 'center', flex: 1 },
  });
