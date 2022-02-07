import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from '../../components/atoms/view/AppView';

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppTextBody2 from '../../components/atoms/text/AppTextBody2';

type Props = StackScreenProps<RootStackParamList, 'Feed'>;

export default function Feed({}: Props) {
  const styles = makeStyle();

  return (
    <AppView darken={true}>
      <View style={{ height: 72 }} />
      <View style={styles.textContainer}>
        <AppTextBody2>Wallet</AppTextBody2>
      </View>
    </AppView>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
    },
  });
