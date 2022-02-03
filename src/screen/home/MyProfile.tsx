import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppView from '../../components/atoms/view/AppView';
import AppTextHeading1 from '../../components/atoms/text/AppTextHeading1';

export default function MyProfile() {
  const styles = makeStyle();

  const loop = () => {
    let ret = [];
    for (let i = 0; i < 100; i++) {
      ret.push(<AppTextHeading1 key={i}>Cooming Soon!</AppTextHeading1>);
    }
    return ret;
  };

  return (
    <AppView>
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
