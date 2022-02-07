import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useTheme } from 'react-native-paper';

import AppIconComponent from '../atoms/icon/AppIconComponent';
import { Theme } from '../../theme/default';

interface AppIconGradientProps {
  name: string;
  size: number;
  colors: string[];
  style?: StyleProp<ViewStyle>;
}

export default function AppIconGradient({
  name,
  size,
  colors,
  style,
}: AppIconGradientProps) {
  const theme = useTheme() as Theme;
  const styles = makeStyles(size, theme);

  return (
    <View style={[{ width: size, height: size }, style]}>
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <AppIconComponent
            name={name}
            size={size}
            color="white"
            style={styles.shadow}
          />
        }>
        <LinearGradient colors={colors} style={styles.gradient} />
      </MaskedView>
    </View>
  );
}

const makeStyles = (size: number, theme: Theme) =>
  StyleSheet.create({
    shadow: {
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.5,
      shadowRadius: 5,
      shadowOffset: {
        width: 0,
        height: 1,
      },
    },
    container: {
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    maskedView: { flex: 1, flexDirection: 'row', height: size },
    gradient: { flex: 1 },
  });
