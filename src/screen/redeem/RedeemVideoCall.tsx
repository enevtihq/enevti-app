import { View, Text } from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

type Props = StackScreenProps<RootStackParamList, 'RedeemVideoCall'>;

export default function RedeemVideoCall({ navigation, route }: Props) {
  return (
    <View style={{ backgroundColor: 'red', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>RedeemVideoCall</Text>
    </View>
  );
}
