import React from 'react';
import { StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';

import { Theme } from '../../../theme/default';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Color from 'color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppActivityIndicator from '../loading/AppActivityIndicator';

interface AppQuaternaryButtonProps {
  children?: React.ReactNode;
  box?: boolean;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function AppQuaternaryButton({
  children,
  box = false,
  onPress,
  loading = false,
  disabled = false,
  icon,
  iconSize,
  iconColor,
  style,
  contentStyle,
  contentContainerStyle,
}: AppQuaternaryButtonProps): JSX.Element {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets, box);

  const opacity = disabled ? 0.2 : 1;

  return loading ? (
    <View style={[styles.quaternaryButton, style]}>
      <AppActivityIndicator
        animating={true}
        style={contentStyle}
        color={theme.colors.text}
      />
    </View>
  ) : (
    <View style={[styles.buttonContainer, style, { opacity: opacity }]}>
      <TouchableRipple
        style={[styles.quaternaryButton, style]}
        onPress={disabled ? undefined : onPress}>
        <View style={[styles.contentContainer, contentContainerStyle]}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={iconSize}
              color={iconColor ? iconColor : theme.colors.text}
              style={[styles.icon, contentStyle]}
            />
          )}
          <View style={contentStyle}>{children}</View>
        </View>
      </TouchableRipple>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets, box: boolean) =>
  StyleSheet.create({
    quaternaryButton: {
      alignItems: 'center',
      paddingHorizontal: wp('2%', insets),
    },
    buttonContainer: {
      borderWidth: box ? StyleSheet.hairlineWidth : 0,
      borderColor: Color(theme.colors.text).alpha(0.2).rgb().toString(),
      borderRadius: theme.roundness,
      height: hp('7.5%', insets),
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      paddingRight: wp('1%', insets),
    },
  });
