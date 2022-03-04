import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
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
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';

interface AppHeaderWizardProps {
  title?: string;
  description?: string;
  mode?: 'icon' | 'emoji' | 'component';
  modeData?: keyof typeof iconMap;
  component?: React.ReactNode;
  back?: boolean;
  backComponent?: React.ReactNode;
  navigation?: StackNavigationProp<RootStackParamList>;
  style?: StyleProp<ViewStyle>;
}

export default function AppHeaderWizard({
  component,
  title,
  description,
  mode = 'component',
  modeData,
  back = false,
  backComponent,
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
          backComponent ? (
            backComponent
          ) : navigation ? (
            <AppIconButton
              size={Platform.OS === 'ios' ? 35 : undefined}
              icon={iconMap.arrowBack}
              onPress={() => navigation.goBack()}
            />
          ) : null
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
      ) : mode === 'component' && component ? (
        component
      ) : null}
      {title ? (
        <AppTextHeading1 style={styles.headerText1}>{title}</AppTextHeading1>
      ) : null}
      {description ? (
        <AppTextBody4 style={styles.body1}>{description}</AppTextBody4>
      ) : null}
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
      alignSelf: 'center',
      textAlign: 'center',
    },
    body1: {
      alignSelf: 'center',
      textAlign: 'center',
      marginTop: hp('2%', insets),
      marginRight: wp('5%', insets),
      marginLeft: wp('5%', insets),
    },
  });
