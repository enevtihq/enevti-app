import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';
import AppTextBody4 from '../atoms/text/AppTextBody4';
import { SafeAreaInsets, wp, hp } from '../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIconGradient from './AppIconGradient';
import { Theme } from '../../theme/default';

interface AppIconBannerProps {
  children: React.ReactNode;
  name: string;
  style?: StyleProp<ViewStyle>;
}

export default function AppIconBanner({
  children,
  name,
  style,
}: AppIconBannerProps) {
  const theme = useTheme() as Theme;
  const insets = useSafeAreaInsets();
  const styles = makeStyles(insets);

  return (
    <View style={[style]}>
      <View style={styles.appIconBannerView}>
        <View style={styles.icon}>
          <AppIconGradient
            name={name}
            size={hp('5%', insets)}
            colors={[theme.colors.primary, theme.colors.secondary]}
          />
        </View>
        <View style={styles.textContainer}>
          <AppTextBody4>{children}</AppTextBody4>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    appIconBannerView: {
      flexDirection: 'row',
      marginTop: wp('2%', insets),
      marginBottom: wp('2%', insets),
      width: '100%',
    },
    icon: {
      marginRight: wp('5%', insets),
      justifyContent: 'center',
    },
    textContainer: {
      paddingRight: wp('2%', insets),
      alignSelf: 'center',
      flex: 1,
    },
  });
