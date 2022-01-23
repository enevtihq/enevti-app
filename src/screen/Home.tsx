import React from 'react';
import { StyleSheet } from 'react-native';
import AppView from '../components/atoms/view/AppView';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextHeading1 from '../components/atoms/text/AppTextHeading1';
import { useSelector } from 'react-redux';

export default function Home() {
  const selector = useSelector(state => state);
  const styles = makeStyle();

  return (
    <AppView>
      <SafeAreaView style={styles.container}>
        <AppTextHeading1 style={styles.text}>
          {JSON.stringify(selector)}
        </AppTextHeading1>
      </SafeAreaView>
    </AppView>
  );
}

const makeStyle = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    text: {
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
  });
