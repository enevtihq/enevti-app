import React from 'react';
import { View, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import AppTextHeading1 from '../../components/atoms/AppTextHeading1';
import AppTextBody3 from '../../components/atoms/AppTextBody3';

interface AppHeaderWizardProps {
  image: JSX.Element;
  title: string;
  description: string;
}

export default function AppHeaderWizard({
  image,
  title,
  description,
}: AppHeaderWizardProps) {
  const styles = makeStyle();

  return (
    <View style={styles.headerContainer}>
      <View style={{ height: hp('6%') }} />
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
    headerText1: {
      marginTop: hp('2.5%'),
      marginBottom: hp('2.5%'),
      alignSelf: 'center',
    },
    body1: {
      alignSelf: 'center',
    },
  });
