import React from 'react';
import { StyleProp, ViewStyle, StyleSheet, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { hp, wp } from 'enevti-app/utils/layout/imageRatio';

import { Theme } from 'enevti-app/theme/default';
import Color from 'color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppActivityIndicator from 'enevti-app/components/atoms/loading/AppActivityIndicator';

interface AppQuaternaryButtonProps {
  children?: React.ReactNode;
  box?: boolean;
  onPress?: () => void;
  loading?: boolean;
  loadingStyle?: StyleProp<ViewStyle>;
  loadingSize?: number;
  disabled?: boolean;
  icon?: string;
  iconRight?: string;
  iconSize?: number;
  iconColor?: string;
  loaderLeft?: boolean;
  loaderColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function AppQuaternaryButton({
  children,
  box = false,
  onPress,
  loading = false,
  loadingStyle,
  loadingSize,
  disabled = false,
  icon,
  iconRight,
  iconSize,
  iconColor,
  loaderColor,
  loaderLeft,
  iconStyle,
  style,
  contentStyle,
  contentContainerStyle,
}: AppQuaternaryButtonProps): JSX.Element {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, box), [theme, box]);

  const opacity = disabled ? 0.2 : 1;

  return loading ? (
    <View style={[styles.quaternaryButton, style]}>
      <AppActivityIndicator
        animating={true}
        style={[styles.loading, loadingStyle]}
        size={loadingSize}
        color={loaderColor ? loaderColor : iconColor ? iconColor : theme.colors.text}
      />
    </View>
  ) : (
    <View style={[styles.buttonContainer, style, { opacity: opacity }]}>
      <TouchableRipple style={[styles.quaternaryButton, style]} onPress={disabled ? undefined : onPress}>
        <View style={[styles.contentContainer, contentContainerStyle]}>
          {icon ? (
            loaderLeft ? (
              <AppActivityIndicator
                animating={true}
                size={15}
                style={[styles.icon]}
                color={loaderColor ? loaderColor : iconColor ? iconColor : theme.colors.text}
              />
            ) : (
              <MaterialCommunityIcons
                name={icon}
                size={iconSize}
                color={iconColor ? iconColor : theme.colors.text}
                style={[styles.icon, iconStyle]}
              />
            )
          ) : null}
          <View style={contentStyle}>{children}</View>
          {iconRight ? (
            <MaterialCommunityIcons
              name={iconRight}
              size={iconSize}
              color={iconColor ? iconColor : theme.colors.text}
              style={[styles.icon, iconStyle]}
            />
          ) : null}
        </View>
      </TouchableRipple>
    </View>
  );
}

const makeStyles = (theme: Theme, box: boolean) =>
  StyleSheet.create({
    quaternaryButton: {
      alignItems: 'center',
      paddingHorizontal: wp('2%'),
    },
    loading: {
      height: hp('7.5%'),
      justifyContent: 'center',
    },
    buttonContainer: {
      borderWidth: box ? StyleSheet.hairlineWidth : 0,
      borderColor: Color(theme.colors.text).alpha(0.2).rgb().toString(),
      borderRadius: theme.roundness,
      height: hp('7.5%'),
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
      paddingRight: wp('1%'),
    },
  });
