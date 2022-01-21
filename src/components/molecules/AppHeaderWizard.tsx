import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { hp, SafeAreaInsets } from '../../utils/imageRatio';

import AppTextHeading1 from '../../components/atoms/text/AppTextHeading1';
import AppTextBody3 from '../atoms/text/AppTextBody3';
import { iconMap } from '../atoms/icon/AppIconComponent';
import AppIconButton from '../atoms/icon/AppIconButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderWizardProps {
  image: JSX.Element;
  title: string;
  description: string;
  back?: boolean;
  navigation?: any;
  style?: StyleProp<ViewStyle>;
}

export default function AppHeaderWizard({
  image,
  title,
  description,
  back = false,
  navigation,
  style,
}: AppHeaderWizardProps) {
  const insets = useSafeAreaInsets();
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
      {image}
      <AppTextHeading1 style={styles.headerText1}>{title}</AppTextHeading1>
      <AppTextBody3 style={styles.body1}>{description}</AppTextBody3>
    </View>
  );
}

const makeStyle = (insets: SafeAreaInsets) =>
  StyleSheet.create({
    headerContainer: {
      flex: 1,
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
    },
  });
