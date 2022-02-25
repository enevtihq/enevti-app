import { View, Text } from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';

type Props = StackScreenProps<RootStackParamList, 'StakePool'>;

export default function StakePool() {
  return (
    <View>
      <Text>StakePool</Text>
    </View>
  );
}
