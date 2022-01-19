import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { IconButton } from 'react-native-paper';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import AppTextHeading1 from '../../components/atoms/text/AppTextHeading1';
import AppTextBody3 from '../atoms/text/AppTextBody3';
import { iconMap } from '../atoms/icon/AppIconComponent';

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
  const styles = makeStyle();

  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.headerSpace}>
        {back ? (
          <IconButton
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

const makeStyle = () =>
  StyleSheet.create({
    headerContainer: {
      flex: 1,
    },
    headerSpace: { height: hp('6%'), justifyContent: 'center' },
    headerText1: {
      marginTop: hp('2.5%'),
      marginBottom: hp('2.5%'),
      alignSelf: 'center',
      textAlign: 'center',
    },
    body1: {
      alignSelf: 'center',
      textAlign: 'center',
    },
  });
