import { View, StyleProp, ViewStyle, StyleSheet, RefreshControl } from 'react-native';
import React from 'react';
import AppMessageNotFound from 'enevti-app/components/molecules/message/AppMessageNotFound';
import AppMessageError from 'enevti-app/components/molecules/message/AppMessageError';
import AppMessageNoInternet from 'enevti-app/components/molecules/message/AppMessageNoInternet';
import { ScrollView } from 'react-native-gesture-handler';
import { ERRORCODE } from 'enevti-app/utils/error/code';

interface AppResponseViewProps {
  status: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onReload?: () => void;
  progressViewOffset?: number;
  refreshing?: boolean;
}

export default function AppResponseView({
  status,
  children,
  style,
  onReload,
  progressViewOffset = 0,
  refreshing = false,
}: AppResponseViewProps) {
  const styles = React.useMemo(() => makeStyles(), []);
  const refreshControl = React.useMemo(
    () =>
      onReload ? (
        <RefreshControl refreshing={refreshing} onRefresh={onReload} progressViewOffset={progressViewOffset} />
      ) : undefined,
    [onReload, progressViewOffset, refreshing],
  );

  return status === 200 ? (
    <View style={style}>{children}</View>
  ) : (
    <ScrollView
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[style, styles.responseView]}>
      {status === 404 ? (
        <AppMessageNotFound />
      ) : status === ERRORCODE.NETWORK_ERROR ? (
        <AppMessageNoInternet />
      ) : (
        <AppMessageError />
      )}
    </ScrollView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    responseView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
