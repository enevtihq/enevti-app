import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import AppView from '../../components/atoms/view/AppView';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={theme.dark === true ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <View style={styles.textContainer}>
          <ScrollView style={{ width: '100%' }}>{loop()}</ScrollView>
        </View>
      </SafeAreaView>
    </AppView>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
