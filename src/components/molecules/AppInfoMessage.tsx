import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { Theme } from 'enevti-app/theme/default';
import Color from 'color';
import { useTheme } from 'react-native-paper';
import AppIconComponent from 'enevti-app/components/atoms/icon/AppIconComponent';
import { hp, SafeAreaInsets, wp } from 'enevti-app/utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import AppTextHeading3 from 'enevti-app/components/atoms/text/AppTextHeading3';

interface AppInfoMessageProps {
  icon: string;
  message: string;
  title?: string;
  box?: boolean;
  style?: StyleProp<ViewStyle>;
}

function Component({ icon, title, message, box, style }: AppInfoMessageProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => makeStyles(theme, insets),
    [theme, insets],
  );

  return (
    <View style={[box ? styles.boxed : styles.normal, style]}>
      <AppIconComponent
        name={icon}
        size={wp('15%', insets)}
        color={theme.colors.placeholder}
        style={styles.info}
      />
      {title ? (
        <AppTextHeading3
          style={[styles.infoMsg, { marginBottom: hp('1%', insets) }]}>
          {title}
        </AppTextHeading3>
      ) : null}
      <AppTextBody4 style={styles.infoMsg} numberOfLines={2}>
        {message}
      </AppTextBody4>
    </View>
  );
}

const makeStyles = (theme: Theme, insets: SafeAreaInsets) =>
  StyleSheet.create({
    boxed: {
      borderColor: theme.dark
        ? Color(theme.colors.background).lighten(0.5).rgb().string()
        : Color(theme.colors.background).darken(0.04).rgb().string(),
      borderWidth: 2,
      borderStyle: 'dashed',
      paddingVertical: wp('5%', insets),
      paddingHorizontal: wp('10%', insets),
    },
    normal: {
      paddingVertical: wp('5%', insets),
      paddingHorizontal: wp('10%', insets),
    },
    info: {
      alignSelf: 'center',
      marginBottom: hp('1%', insets),
    },
    infoMsg: {
      alignSelf: 'center',
      color: theme.colors.placeholder,
      textAlign: 'center',
    },
  });

const AppInfoMessage = React.memo(Component);
export default AppInfoMessage;
