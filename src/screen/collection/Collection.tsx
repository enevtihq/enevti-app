import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import AppView from '../../components/atoms/view/AppView';
import {
  resetStatusBarBackground,
  setStatusBarBackground,
} from '../../store/slices/ui/global/statusbar';
import { RootStackParamList } from '../../navigation';
import AppCollection from 'enevti-app/components/organism/collection/AppCollection';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';

type Props = StackScreenProps<RootStackParamList, 'Collection'>;

export default function Collection({ navigation, route }: Props) {
  const { id } = route.params;
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setStatusBarBackground('transparent'));
    return function cleanup() {
      dispatch(resetStatusBarBackground());
    };
  }, [dispatch]);

  return (
    <AppView
      darken
      withModal
      translucentStatusBar
      edges={['bottom', 'left', 'right']}
      headerOffset={0}
      header={<AppHeader back navigation={navigation} title={'Collection'} />}>
      <AppCollection id={id} />
    </AppView>
  );
}
