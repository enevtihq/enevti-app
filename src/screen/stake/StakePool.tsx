import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { useTranslation } from 'react-i18next';
import AppStakePool from 'enevti-app/components/organism/stake/AppStakePool';

type Props = StackScreenProps<RootStackParamList, 'StakePool'>;

export default function StakePool({ navigation, route }: Props) {
  const { t } = useTranslation();

  return (
    <AppView
      darken
      withModal
      edges={['left', 'bottom', 'right']}
      header={
        <AppHeader back navigation={navigation} title={t('stake:stakePool')} />
      }>
      <AppStakePool route={route} />
    </AppView>
  );
}
