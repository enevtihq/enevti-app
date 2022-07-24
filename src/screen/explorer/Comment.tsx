import React from 'react';
import AppView from 'enevti-app/components/atoms/view/AppView';
import AppHeader from 'enevti-app/components/atoms/view/AppHeader';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'enevti-app/navigation';
import { useTranslation } from 'react-i18next';
import AppCommentItem from 'enevti-app/components/molecules/comment/AppCommentItem';
import AppCommentBox from 'enevti-app/components/molecules/comment/AppCommentBox';

type Props = StackScreenProps<RootStackParamList, 'Comment'>;

export default function Comment({ navigation }: Props) {
  const { t } = useTranslation();

  return (
    <AppView
      darken
      edges={['left', 'bottom', 'right']}
      header={<AppHeader back navigation={navigation} title={t('explorer:commentTitle')} />}>
      <AppCommentItem />
      {/* <AppCommentItem />
      <AppCommentItem />
      <AppCommentItem /> */}
      <AppCommentBox />
    </AppView>
  );
}
