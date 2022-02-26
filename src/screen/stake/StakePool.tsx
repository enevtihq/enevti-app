import { Text } from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppView from '../../components/atoms/view/AppView';
import AppHeader from '../../components/atoms/view/AppHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = StackScreenProps<RootStackParamList, 'StakePool'>;

export default function StakePool({ navigation, route }: Props) {
  const { persona } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <AppView
      edges={['left', 'bottom', 'right']}
      header={<AppHeader back navigation={navigation} title={'stake'} />}>
      <Text>anjay</Text>
    </AppView>
  );
}
