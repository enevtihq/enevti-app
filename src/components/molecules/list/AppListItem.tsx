import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import Color from 'color';
import { Theme } from '../../../theme/default';
import { SafeAreaInsets, wp } from '../../../utils/imageRatio';
import { TouchableRipple } from 'react-native-paper';

export const LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE = 2;

interface AppListItemProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onPress?: () => void;
}

export default function AppListItem({
  children,
  style,
  leftContent,
  rightContent,
  onPress,
}: AppListItemProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = makeStyle(theme, insets);

  return (
    <View style={styles.listContainer}>
      <TouchableRipple onPress={onPress}>
        <View style={[styles.itemContainer, style]}>
          {leftContent}
          <View style={styles.contentContainer}>{children}</View>
          {rightContent}
        </View>
      </TouchableRipple>
    </View>
  );
}

const makeStyle = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    listContainer: {
      marginHorizontal: wp('5%', insets),
      marginVertical: wp(LIST_ITEM_VERTICAL_MARGIN_PERCENTAGE / 2, insets),
      backgroundColor: theme.colors.background,
      borderRadius: theme.roundness,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Color(theme.colors.text).alpha(0.05).rgb().toString(),
      overflow: 'hidden',
    },
    itemContainer: {
      flexDirection: 'row',
      paddingVertical: wp('2%', insets),
      paddingHorizontal: wp('3%', insets),
    },
    contentContainer: { justifyContent: 'center', flex: 1 },
  });
