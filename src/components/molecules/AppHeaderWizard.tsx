import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

import { hp, wp, SafeAreaInsets } from '../../utils/imageRatio';
import AppTextHeading1 from '../../components/atoms/text/AppTextHeading1';
import AppTextBody4 from '../atoms/text/AppTextBody4';
import { iconMap } from '../atoms/icon/AppIconComponent';
import AppIconButton from '../atoms/icon/AppIconButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIconGradient from './AppIconGradient';
import { Theme } from '../../theme/default';
import AppEmojiComponent, { emojiMap } from '../atoms/icon/AppEmojiComponent';

interface AppHeaderWizardProps {
  title: string;
  description: string;
  mode?: 'icon' | 'emoji' | 'image';
  modeData?: keyof typeof iconMap;
  image?: JSX.Element;
  back?: boolean;
  navigation?: any;
  style?: StyleProp<ViewStyle>;
}

export default function AppHeaderWizard({
  image,
  title,
  description,
  mode = 'image',
  modeData,
  back = false,
  navigation,
  style,
}: AppHeaderWizardProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = makeStyle(insets);

  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.headerSpace}>
        {back ? (
          <AppIconButton
            icon={iconMap.arrowBack}
            onPress={() => navigation.goBack()}
          />
        ) : null}
      </View>
      {mode === 'icon' && modeData ? (
        <AppIconGradient
          name={iconMap[modeData]}
          size={wp('25%', insets)}
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.headerImage}
        />
      ) : mode === 'emoji' && modeData ? (
        <AppEmojiComponent name={emojiMap[modeData]} style={styles.emoji} />
      ) : mode === 'image' && image ? (
        image
      ) : null}
      <AppTextHeading1 style={styles.headerText1}>{title}</AppTextHeading1>
      <AppTextBody4 style={styles.body1}>{description}</AppTextBody4>
    </View>
  );
}

const makeStyle = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    emoji: {
      alignSelf: 'center',
      fontSize: wp('20%', insets),
    },
    headerContainer: {
      flex: 1,
    },
    headerImage: {
      alignSelf: 'center',
    },
    headerSpace: {
      height: hp('6%', insets),
      justifyContent: 'center',
    },
    headerText1: {
      marginTop: hp('2%', insets),
      marginBottom: hp('2%', insets),
      alignSelf: 'center',
      textAlign: 'center',
    },
    body1: {
      alignSelf: 'center',
      textAlign: 'center',
      marginRight: wp('5%', insets),
      marginLeft: wp('5%', insets),
    },
  });
