import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { wp, hp } from 'enevti-app/utils/layout/imageRatio';
import AppIconGradient from './AppIconGradient';
import { Theme } from 'enevti-app/theme/default';

interface AppIconBannerProps {
  children: React.ReactNode;
  name: string;
  style?: StyleProp<ViewStyle>;
}

export default function AppIconBanner({ children, name, style }: AppIconBannerProps) {
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);

  return (
    <View style={[style]}>
      <View style={styles.appIconBannerView}>
        <View style={styles.icon}>
          <AppIconGradient name={name} size={hp('5%')} colors={[theme.colors.primary, theme.colors.secondary]} />
        </View>
        <View style={styles.textContainer}>
          <AppTextBody4>{children}</AppTextBody4>
        </View>
      </View>
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    appIconBannerView: {
      flexDirection: 'row',
      marginTop: wp('2%'),
      marginBottom: wp('2%'),
      width: '100%',
    },
    icon: {
      marginRight: wp('5%'),
      justifyContent: 'center',
    },
    textContainer: {
      paddingRight: wp('2%'),
      alignSelf: 'center',
      flex: 1,
    },
  });
