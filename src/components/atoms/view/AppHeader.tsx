import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Platform, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Appbar, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from 'enevti-app/navigation';
import { Theme } from 'enevti-app/theme/default';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import AppBrandBanner from 'enevti-app/components/molecules/AppBrandBanner';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';

export const HEADER_HEIGHT_PERCENTAGE = 9.5;
export const HEADER_HEIGHT_COMPACT_PERCENTAGE = 6;

interface AppHeaderProps {
  children?: React.ReactNode;
  back?: boolean;
  backIconSize?: number;
  navigation?: StackNavigationProp<RootStackParamList>;
  style?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  withAnimatedGradient?: boolean;
  height?: number;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  backIcon?: string;
}

export default function AppHeader({
  style,
  backgroundStyle,
  textStyle,
  subtitleStyle,
  iconStyle,
  withAnimatedGradient,
  height,
  children,
  back = false,
  backIconSize,
  backIcon,
  navigation,
  title,
  subtitle,
  compact = false,
}: AppHeaderProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const headerHeight = height
    ? height
    : compact
    ? hp(HEADER_HEIGHT_COMPACT_PERCENTAGE, insets)
    : hp(HEADER_HEIGHT_PERCENTAGE, insets);
  const styles = React.useMemo(() => makeStyles(theme, headerHeight, insets), [theme, headerHeight, insets]);

  return (
    <Animated.View style={[styles.headerContainer, style]}>
      <Appbar.Header statusBarHeight={0} style={styles.header}>
        {back && navigation ? (
          <AppIconButton
            icon={backIcon ?? iconMap.arrowBack}
            size={backIconSize ? backIconSize : Platform.OS === 'ios' ? 35 : 23}
            color={theme.colors.text}
            onPress={() => navigation.goBack()}
            style={styles.customBackIcon}
            animatedIconStyle={iconStyle}
          />
        ) : null}
        {title ? (
          <View style={{ marginLeft: wp('5%', insets) }}>
            <Animated.Text style={[styles.title, textStyle]}>{title}</Animated.Text>
            {subtitle ? <Animated.Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Animated.Text> : null}
          </View>
        ) : (
          <AppBrandBanner widthPercentage={0.35} style={styles.image} />
        )}
        <View style={styles.divider} />
        {children ? children : <View />}
      </Appbar.Header>
      <Animated.View style={[styles.headerBar, backgroundStyle]} />
      {withAnimatedGradient ? (
        <LinearGradient colors={['#000000', 'transparent']} style={styles.headerGradientBar} />
      ) : null}
    </Animated.View>
  );
}

const makeStyles = (theme: Theme, height: number, insets: SafeAreaInsets) =>
  StyleSheet.create({
    divider: {
      flex: 1,
    },
    headerBar: {
      backgroundColor: theme.colors.background,
      height: height + insets.top,
      width: '100%',
      position: 'absolute',
      zIndex: 998,
    },
    headerGradientBar: {
      height: height + insets.top,
      width: '100%',
      position: 'absolute',
      zIndex: 997,
    },
    headerContainer: {
      zIndex: 999,
    },
    header: {
      position: 'absolute',
      backgroundColor: 'transparent',
      width: '100%',
      marginTop: insets.top,
      height: height,
      zIndex: 999,
    },
    image: {
      marginLeft: 8,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.fonts.medium.fontFamily,
      fontWeight: theme.fonts.medium.fontWeight,
      fontSize: wp('5.2%', insets),
    },
    subtitle: {
      color: theme.colors.placeholder,
      fontFamily: theme.fonts.light.fontFamily,
      fontWeight: theme.fonts.light.fontWeight,
      fontSize: wp('4.0%', insets),
    },
    customBackIcon: {
      marginLeft: wp('3%', insets),
    },
  });
