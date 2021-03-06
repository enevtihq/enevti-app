import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import AppView from 'enevti-app/components/atoms/view/AppView';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextHeading1 from 'enevti-app/components/atoms/text/AppTextHeading1';
import { useTheme } from 'react-native-paper';

export default function Statistics() {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(), []);

  return (
    <AppView>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={theme.dark === true ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <View style={styles.textContainer}>
          <AppTextHeading1>Cooming Soon!</AppTextHeading1>
        </View>
      </SafeAreaView>
    </AppView>
  );
}

const makeStyles = () =>
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
