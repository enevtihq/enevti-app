import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { useTranslation } from 'react-i18next';
import AppStakePool from 'enevti-app/components/organism/stake/AppStakePool';
import { RouteProp } from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'StakePool'>;

export default function StakePool({ navigation, route }: Props) {
  const { t } = useTranslation();

  const screenRoute = React.useMemo(() => ({ params: route.params }), [route.params]) as RouteProp<
    RootStackParamList,
    'StakePool'
  >;

  return (
    <AppView
      darken
      withModal
      withLoader
      withPayment
      edges={['left', 'bottom', 'right']}
      header={<AppHeader back navigation={navigation} title={t('stake:stakePool')} />}>
      <AppStakePool route={screenRoute} />
    </AppView>
  );
}
