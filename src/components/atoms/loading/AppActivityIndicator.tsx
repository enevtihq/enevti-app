import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import CircularProgress from 'react-native-circular-progress-indicator';

interface AppActivityIndicatorProps {
  mode?: 'activity' | 'progress';
  animating?: boolean;
  style?: StyleProp<ViewStyle>;
  color?: string;
  progress?: number;
}

export default function AppActivityIndicator({
  mode = 'activity',
  animating,
  style,
  color,
  progress,
}: AppActivityIndicatorProps) {
  const theme = useTheme();
  const loaderColor = theme.colors.primary;
  const styles = React.useMemo(() => makeStyles(), []);

  return (
    <View style={style}>
      {mode === 'activity' ? (
        <ActivityIndicator
          animating={animating}
          color={color ? color : loaderColor}
        />
      ) : mode === 'progress' && progress !== undefined ? (
        <View style={styles.progressView}>
          <CircularProgress
            value={progress}
            radius={14}
            progressValueColor={color ? color : loaderColor}
            activeStrokeColor={color ? color : loaderColor}
            activeStrokeWidth={3}
            inActiveStrokeWidth={0}
          />
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    progressView: {
      alignSelf: 'center',
    },
  });
