import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from '../../components/atoms/view/AppView';
import AppTextHeading1 from '../../components/atoms/text/AppTextHeading1';

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';

type Props = StackScreenProps<RootStackParamList, 'Feed'>;

export default function Feed({}: Props) {
  const styles = makeStyle();

  const loop = () => {
    let ret = [];
    for (let i = 0; i < 100; i++) {
      ret.push(<AppTextHeading1 key={i}>Cooming Soon!</AppTextHeading1>);
    }
    return ret;
  };

  return (
    <AppView darken={true}>
      <View style={styles.textContainer}>{loop()}</View>
    </AppView>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
    },
  });
