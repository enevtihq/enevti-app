import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../navigation';
import { Theme } from '../../../theme/default';
import { hp, SafeAreaInsets, wp } from '../../../utils/imageRatio';
import AppBrandBanner from '../../molecules/AppBrandBanner';

export const HEADER_HEIGHT_PERCENTAGE = 9.5;

interface AppHeaderProps {
  children?: React.ReactNode;
  back?: boolean;
  navigation?: StackNavigationProp<RootStackParamList>;
  style?: StyleProp<ViewStyle>;
  height?: number;
  title?: string;
  subtitle?: string;
}

export default function AppHeader({
  style,
  height,
  children,
  back = false,
  navigation,
  title,
  subtitle,
}: AppHeaderProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const headerHeight = height ? height : hp(HEADER_HEIGHT_PERCENTAGE, insets);
  const styles = makeStyles(theme, headerHeight, insets);

  return (
    <Animated.View style={style}>
      <Appbar.Header style={styles.header}>
        {back && navigation ? (
          <Appbar.BackAction
            size={Platform.OS === 'ios' ? 20 : undefined}
            onPress={() => navigation.goBack()}
          />
        ) : null}
        {title ? (
          <Appbar.Content
            title={title}
            subtitle={subtitle}
            titleStyle={styles.title}
            subtitleStyle={styles.subtitle}
          />
        ) : (
          <AppBrandBanner widthPercentage={0.35} style={styles.image} />
        )}
        <View style={styles.divider} />
        {children ? children : <View />}
      </Appbar.Header>
    </Animated.View>
  );
}

const makeStyles = (theme: Theme, height: number, insets: SafeAreaInsets) =>
  StyleSheet.create({
    divider: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      backgroundColor: theme.colors.background,
      width: '100%',
      marginTop: insets.top,
      height: height,
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
  });
