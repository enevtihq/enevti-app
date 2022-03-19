import React from 'react';
import { Modal, Portal } from 'react-native-paper';
import AppListItem from '../../molecules/list/AppListItem';
import AppActivityIndicator from './AppActivityIndicator';
import AppTextBody4 from '../text/AppTextBody4';
import { useTranslation } from 'react-i18next';
import { wp } from '../../../utils/imageRatio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppModalLoaderProps {
  visible: boolean;
}

export default function AppModalLoader({ visible }: AppModalLoaderProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Portal>
      <Modal dismissable={false} visible={visible}>
        <AppListItem
          style={{ margin: wp('5%', insets) }}
          leftContent={
            <AppActivityIndicator style={{ marginRight: wp('5%', insets) }} />
          }>
          <AppTextBody4>{t('form:loading')}</AppTextBody4>
        </AppListItem>
      </Modal>
    </Portal>
  );
}
