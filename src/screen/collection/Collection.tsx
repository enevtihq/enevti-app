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

type Props = StackScreenProps<RootStackParamList, 'Collection'>;

export default function Collection({ route }: Props) {
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
      edges={['bottom', 'left', 'right']}>
      <AppCollection id={id} />
    </AppView>
  );
}
