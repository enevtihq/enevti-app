import React from 'react';
import AppView from '../components/atoms/view/AppView';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextHeading1 from '../components/atoms/text/AppTextHeading1';
import { useSelector } from 'react-redux';

export default function Home() {
  const selector = useSelector(state => state);

  return (
    <AppView>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'blue' }}>
        <AppTextHeading1
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          {JSON.stringify(selector)}
        </AppTextHeading1>
      </SafeAreaView>
    </AppView>
  );
}
