import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AppView from '../../components/atoms/view/AppView';
import AppTextHeading1 from '../../components/atoms/text/AppTextHeading1';
import { useTheme } from 'react-native-paper';

export default function Feed() {
  const theme = useTheme();
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
      <View style={styles.textContainer}>
        <ScrollView style={{ width: '100%' }}>{loop()}</ScrollView>
      </View>
    </AppView>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
