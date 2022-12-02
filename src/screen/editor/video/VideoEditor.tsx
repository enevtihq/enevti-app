import { Text } from 'react-native';
import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { iconMap } from 'enevti-app/components/atoms/icon/AppIconComponent';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

type Props = StackScreenProps<RootStackParamList, 'VideoEditor'>;

export default function VideoEditor({ navigation }: Props) {
  return (
    <AppView
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      header={
        <AppHeader compact back backIcon={iconMap.close} backIconSize={23} navigation={navigation} title={' '} />
      }>
      <Text>ERROR: This Component is only available for iOS!</Text>
    </AppView>
  );
}
