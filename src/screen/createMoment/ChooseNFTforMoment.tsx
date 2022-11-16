import { View, Text } from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';

type Props = StackScreenProps<RootStackParamList, 'ChooseNFTforMoment'>;

export default function ChooseNFTforMoment({ navigation, route }: Props) {
  return (
    <View>
      <Text>ChooseNFTforMoment</Text>
    </View>
  );
}
