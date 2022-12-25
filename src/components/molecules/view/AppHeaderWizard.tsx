import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

import { hp, wp } from 'enevti-app/utils/layout/imageRatio';
import AppTextHeading1 from 'enevti-app/components/atoms/text/AppTextHeading1';
import AppTextBody4 from 'enevti-app/components/atoms/text/AppTextBody4';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import AppIconButton from 'enevti-app/components/atoms/icon/AppIconButton';
import AppIconGradient from '../icon/AppIconGradient';
import { Theme } from 'enevti-app/theme/default';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { shallowEqual } from 'react-redux';

interface AppHeaderWizardProps {
  title?: string;
  description?: string;
  mode?: 'icon' | 'component';
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
  const theme = useTheme() as Theme;
  const styles = React.useMemo(() => makeStyles(), []);

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
              style={{ marginLeft: wp('2%') }}
            />
          ) : null
        ) : null}
      </View>
      {mode === 'icon' && modeData ? (
        <AppIconGradient
          name={iconMap[modeData]}
          size={hp('12%')}
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.headerImage}
        />
      ) : mode === 'component' && component ? (
        component
      ) : null}
      {title ? <AppTextHeading1 style={[styles.headerText1, titleStyle]}>{title}</AppTextHeading1> : null}
      {description ? <AppTextBody4 style={[styles.body1, descriptionStyle]}>{description}</AppTextBody4> : null}
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    emoji: {
      alignSelf: 'center',
      fontSize: wp('20%'),
    },
    headerContainer: {
      flex: 1,
    },
    headerImage: {
      alignSelf: 'center',
    },
    headerSpace: {
      height: hp('6%'),
      justifyContent: 'center',
    },
    headerText1: {
      marginTop: hp('2%'),
      alignSelf: 'center',
      textAlign: 'center',
    },
    body1: {
      alignSelf: 'center',
      textAlign: 'center',
      marginTop: hp('2%'),
      marginRight: wp('5%'),
      marginLeft: wp('5%'),
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
