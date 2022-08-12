import { View, StyleSheet } from 'react-native';
import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { RootStackParamList } from 'enevti-app/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import AppNotificationScreen from 'enevti-app/components/organism/notification/AppNotificationScreen';

type Props = StackScreenProps<RootStackParamList, 'Notification'>;

export default function Notification({ navigation }: Props) {
  const styles = React.useMemo(() => makeStyles(), []);

  return (
    <AppView
      darken
      edges={['left', 'bottom', 'right']}
      header={<AppHeader back navigation={navigation} title={'Notification'} />}>
      <View style={styles.container}>
        <AppNotificationScreen navigation={navigation} />
      </View>
    </AppView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });
