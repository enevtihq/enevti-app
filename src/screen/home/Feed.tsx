import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from '../../components/atoms/view/AppView';

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppRecentMoments from '../../components/organism/AppRecentMoments';

type Props = StackScreenProps<RootStackParamList, 'Feed'>;

export default function Feed({}: Props) {
  const styles = makeStyle();

  return (
    <AppView darken={true}>
      <View style={{ height: 72 }} />
      <View style={styles.textContainer}>
        <AppRecentMoments />
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
