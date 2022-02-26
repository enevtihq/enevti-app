import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppView from '../../components/atoms/view/AppView';
import AppHeader from '../../components/atoms/view/AppHeader';
import AppListItem from '../../components/molecules/list/AppListItem';
import AppFloatingActionButton from '../../components/atoms/view/AppFloatingActionButton';

type Props = StackScreenProps<RootStackParamList, 'StakePool'>;

export default function StakePool({ navigation, route }: Props) {
  const { persona } = route.params;

  return (
    <AppView
      darken
      edges={['left', 'bottom', 'right']}
      header={<AppHeader back navigation={navigation} title={'Stake Pool'} />}>
      <AppFloatingActionButton />
      <AppListItem />
      <AppListItem />
      <AppListItem />
      <AppListItem />
    </AppView>
  );
}
