import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
  TextStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { hp, wp, SafeAreaInsets } from 'enevti-app/utils/imageRatio';
import AppTextHeading1 from 'enevti-app/components/atoms/text/AppTextHeading1';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIconGradient from './AppIconGradient';
import { Theme } from 'enevti-app/theme/default';
import AppEmojiComponent, {
  emojiMap,
} from 'enevti-app/components/atoms/icon/AppEmojiComponent';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { shallowEqual } from 'react-redux';

interface AppHeaderWizardProps {
  title?: string;
  description?: string;
  mode?: 'icon' | 'emoji' | 'component';
  modeData?: keyof typeof iconMap;
  component?: React.ReactNode;
  back?: boolean;
  backIcon?: string;
  backComponent?: React.ReactNode;
  onBack?: () => void;
  navigation?: StackNavigationProp<RootStackParamList>;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  noHeaderSpace?: boolean;
  memoKey?: (keyof AppHeaderWizardProps)[];
}

function Component({
  component,
  title,
  description,
  mode = 'component',
  modeData,
  back = false,
  backIcon,
  backComponent,
  onBack,
  navigation,
  style,
  titleStyle,
  descriptionStyle,
  noHeaderSpace,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memoKey,
}: AppHeaderWizardProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(insets), [insets]);

  const onBackPressed = React.useCallback(() => {
    onBack && onBack();
    navigation && navigation.goBack();
  }, [navigation, onBack]);

  return (
    <View style={[styles.headerContainer, style]}>
      <View style={noHeaderSpace ? undefined : styles.headerSpace}>
        {back ? (
          backComponent ? (
            backComponent
          ) : navigation ? (
            <AppIconButton
              size={Platform.OS === 'ios' && !backIcon ? 35 : 23}
              icon={backIcon ?? iconMap.arrowBack}
              onPress={onBackPressed}
              style={{ marginLeft: wp('2%', insets) }}
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
        <AppTextHeading1 style={[styles.headerText1, titleStyle]}>
          {title}
        </AppTextHeading1>
      ) : null}
      {description ? (
        <AppTextBody4 style={[styles.body1, descriptionStyle]}>
          {description}
        </AppTextBody4>
      ) : null}
    </View>
  );
}

const makeStyles = (insets: SafeAreaInsets) =>
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

const AppHeaderWizard = React.memo(Component, (prevProps, nextProps) => {
  if (prevProps.memoKey) {
    let ret = true;
    prevProps.memoKey.forEach(key => {
      if (prevProps[key] !== nextProps[key]) {
        ret = false;
      }
    });
    return ret;
  } else {
    return shallowEqual(prevProps, nextProps);
  }
});
export default AppHeaderWizard;
