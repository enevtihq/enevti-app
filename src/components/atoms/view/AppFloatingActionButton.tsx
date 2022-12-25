import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import { AnimatedFAB, useTheme } from 'react-native-paper';
import { wp } from 'enevti-app/utils/layout/imageRatio';

interface AppFloatingActionButtonProps {
  label: string;
  icon: string;
  extended?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export default function AppFloatingActionButton({
  label,
  icon,
  extended = true,
  style,
  onPress,
}: AppFloatingActionButtonProps) {
  const theme = useTheme();
  theme.colors.accent = theme.colors.primary;
  const styles = React.useMemo(() => makeStyles(), []);

  return (
    <AnimatedFAB
      extended={extended}
      theme={theme}
      style={[styles.fab, style]}
      uppercase={false}
      label={label}
      icon={icon}
      onPress={onPress}
    />
  );
}

const makeStyles = () =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      margin: wp('6%'),
      zIndex: 99,
    },
  });
