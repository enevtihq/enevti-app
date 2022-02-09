import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from '../../components/atoms/view/AppView';

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppRecentMoments from '../../components/organism/AppRecentMoments';
import AppFeedItem from '../../components/molecules/AppFeedItem';

type Props = StackScreenProps<RootStackParamList, 'Feed'>;

export default function Feed({}: Props) {
  const styles = makeStyle();

  return (
    <AppView darken={true}>
      <View style={{ height: 72 }} />
      <View style={styles.textContainer}>
        <AppRecentMoments />
        <AppFeedItem />
      </View>
    </AppView>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
    },
    shadowProp: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
  });
