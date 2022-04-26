import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import React from 'react';
import AppMessageNotFound from 'enevti-app/components/molecules/message/AppMessageNotFound';
import AppMessageError from 'enevti-app/components/molecules/message/AppMessageError';

interface AppResponseViewProps {
  status: number;
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
}

export default function AppResponseView({ status, children, style }: AppResponseViewProps) {
  const styles = React.useMemo(() => makeStyles(), []);

  return status === 200 ? (
    <View style={style}>{children}</View>
  ) : status === 404 ? (
    <View style={[style, styles.responseView]}>
      <AppMessageNotFound />
    </View>
  ) : (
    <View style={[style, styles.responseView]}>
      <AppMessageError />
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    responseView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
