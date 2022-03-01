import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import AppView from '../../components/atoms/view/AppView';
import AppHeader from '../../components/atoms/view/AppHeader';
import AppListItem from '../../components/molecules/list/AppListItem';
import AppFloatingActionButton from '../../components/atoms/view/AppFloatingActionButton';
import { StakePoolData } from '../../types/service/enevti/stake';
import { getStakePoolCompleteData } from '../../service/enevti/stake';
import { handleError } from '../../utils/error/handle';

type Props = StackScreenProps<RootStackParamList, 'StakePool'>;

export default function StakePool({ navigation, route }: Props) {
  const { persona } = route.params;
  const [stakePool, setStakePool] = React.useState<StakePoolData>();

  const onLoaded = React.useCallback(async () => {
    try {
      const pool = await getStakePoolCompleteData(persona.address);
      if (pool) {
        setStakePool(pool);
      }
    } catch (err: any) {
      handleError(err);
    }
  }, [persona.address]);

  React.useEffect(() => {
    onLoaded();
  }, [onLoaded]);

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
