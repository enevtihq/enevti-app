import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { Theme } from 'enevti-app/theme/default';
import AppTextBodyCustom from '../text/AppTextBodyCustom';

interface AppBadgeProps {
  offset?: number;
  content?: string;
}

export default function AppBadge({ offset, content }: AppBadgeProps) {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(theme, offset, content), [theme, offset, content]);

  return (
    <View pointerEvents={'none'} style={styles.container}>
      <AppTextBodyCustom size={2.6} style={styles.content}>
        {content}
      </AppTextBodyCustom>
    </View>
  );
}

const makeStyles = (theme: Theme, offset?: number, content?: string) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      alignSelf: 'flex-end',
      borderRadius: content ? 16 : 12,
      minWidth: content ? 16 : undefined,
      height: content ? undefined : 12,
      width: content ? undefined : 12,
      right: offset ?? undefined,
      top: offset ?? undefined,
      backgroundColor: theme.colors.notification,
    },
    content: {
      color: 'white',
      textAlign: 'center',
      paddingHorizontal: 3,
    },
  });
